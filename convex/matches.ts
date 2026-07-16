import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { publicJobValidator, toPublicJob } from "./jobs";

const matchResultValidator = v.object({
  jobId: v.id("jobListings"),
  title: v.string(),
  company: v.string(),
  score: v.number(),
  matchedSkills: v.array(v.string()),
  missingSkills: v.array(v.string()),
  reasoning: v.string(),
});

type MatchResult = {
  jobId: Id<"jobListings">;
  title: string;
  company: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
};

type PublicJob = ReturnType<typeof toPublicJob>;

/** Convert a cosine similarity score (-1..1) to a 0-100 percentage. */
function toPercentage(cosineScore: number): number {
  return Math.round(Math.max(0, Math.min(1, cosineScore)) * 100);
}

function skillOverlap(
  profileSkills: string[],
  jobSkills: string[],
): { matched: string[]; missing: string[] } {
  const profileSet = new Set(profileSkills.map((s) => s.toLowerCase()));
  const matched = jobSkills.filter((s) => profileSet.has(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !profileSet.has(s.toLowerCase()));
  return { matched, missing };
}

export const getProfileWithEmbedding = internalQuery({
  args: { clerkUserId: v.string() },
  returns: v.union(
    v.object({
      userId: v.id("users"),
      skills: v.array(v.string()),
      embedding: v.union(v.array(v.float64()), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      return null;
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) {
      return null;
    }
    return {
      userId: user._id,
      skills: profile.skills,
      embedding: profile.embedding ?? null,
    };
  },
});

export const getJobsByIds = internalQuery({
  args: { jobIds: v.array(v.id("jobListings")) },
  returns: v.array(publicJobValidator),
  handler: async (ctx, args) => {
    const jobs = [];
    for (const jobId of args.jobIds) {
      const job = await ctx.db.get(jobId);
      if (job) {
        jobs.push(toPublicJob(job));
      }
    }
    return jobs;
  },
});

export const upsertMatch = internalMutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    score: v.number(),
    matchedSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    reasoning: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("matches")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId),
      )
      .unique();
    const fields = {
      score: args.score,
      matchedSkills: args.matchedSkills,
      missingSkills: args.missingSkills,
      reasoning: args.reasoning,
      createdAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("matches", {
        userId: args.userId,
        jobId: args.jobId,
        ...fields,
      });
    }
    return null;
  },
});

/**
 * Vector-search open job listings against the candidate's profile embedding,
 * persist the results in `matches`, and return them sorted by score.
 * Run with: `npx convex run matches:findSimilarJobs '{"clerkUserId": "user_demo_candidate"}'`
 */
export const findSimilarJobs = action({
  args: {
    clerkUserId: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(matchResultValidator),
  handler: async (ctx, args): Promise<MatchResult[]> => {
    // Explicit annotations break circular type inference (action and the
    // internal functions it calls live in the same file).
    const profile: {
      userId: Id<"users">;
      skills: string[];
      embedding: number[] | null;
    } | null = await ctx.runQuery(internal.matches.getProfileWithEmbedding, {
      clerkUserId: args.clerkUserId,
    });
    if (!profile) {
      throw new Error(`No profile found for Clerk user ${args.clerkUserId}`);
    }
    if (!profile.embedding) {
      throw new Error(
        "Profile has no embedding yet. Run embeddings:backfill first.",
      );
    }

    const limit = Math.min(args.limit ?? 10, 50);
    const results = await ctx.vectorSearch("jobListings", "by_embedding", {
      vector: profile.embedding,
      limit,
      filter: (q) => q.eq("status", "open"),
    });

    const jobs: PublicJob[] = await ctx.runQuery(
      internal.matches.getJobsByIds,
      { jobIds: results.map((r) => r._id) },
    );
    const jobById = new Map(jobs.map((job) => [job._id, job]));

    const matches: MatchResult[] = [];
    for (const result of results) {
      const job = jobById.get(result._id);
      if (!job) {
        continue;
      }
      const score = toPercentage(result._score);
      const { matched, missing } = skillOverlap(profile.skills, job.skills);
      const reasoning = `Profile similarity ${score}%. Matches ${matched.length} of ${job.skills.length} listed skills${
        matched.length > 0 ? ` (${matched.join(", ")})` : ""
      }${missing.length > 0 ? `; missing ${missing.join(", ")}` : ""}.`;

      await ctx.runMutation(internal.matches.upsertMatch, {
        userId: profile.userId,
        jobId: job._id,
        score,
        matchedSkills: matched,
        missingSkills: missing,
        reasoning,
      });

      matches.push({
        jobId: job._id,
        title: job.title,
        company: job.company,
        score,
        matchedSkills: matched,
        missingSkills: missing,
        reasoning,
      });
    }

    matches.sort((a, b) => b.score - a.score);
    return matches;
  },
});

/** Persisted matches for a user, joined with job info, sorted by score. */
export const listForUser = query({
  args: { clerkUserId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("matches"),
      score: v.number(),
      matchedSkills: v.array(v.string()),
      missingSkills: v.array(v.string()),
      reasoning: v.string(),
      createdAt: v.number(),
      job: v.union(publicJobValidator, v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      return [];
    }
    const rows = await ctx.db
      .query("matches")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const enriched = [];
    for (const row of rows) {
      const job = await ctx.db.get(row.jobId as Id<"jobListings">);
      enriched.push({
        _id: row._id,
        score: row.score,
        matchedSkills: row.matchedSkills,
        missingSkills: row.missingSkills,
        reasoning: row.reasoning,
        createdAt: row.createdAt,
        job: job ? toPublicJob(job) : null,
      });
    }
    enriched.sort((a, b) => b.score - a.score);
    return enriched;
  },
});
