import { embedMany } from "ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

const EMBEDDING_MODEL = "openai/text-embedding-3-small"; // 1536 dims, via Vercel AI Gateway

/** Embed a batch of texts through the AI Gateway. */
export async function embedTexts(values: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values,
  });
  return embeddings;
}

function jobEmbeddingText(job: {
  title: string;
  company: string;
  seniority: string;
  description: string;
  skills: string[];
  requirements: string[];
}): string {
  return [
    `${job.title} at ${job.company} (${job.seniority})`,
    job.description,
    `Skills: ${job.skills.join(", ")}`,
    `Requirements: ${job.requirements.join("; ")}`,
  ].join("\n");
}

function profileEmbeddingText(profile: {
  headline: string;
  summary: string;
  skills: string[];
  desiredRoles: string[];
}): string {
  return [
    profile.headline,
    profile.summary,
    `Skills: ${profile.skills.join(", ")}`,
    `Desired roles: ${profile.desiredRoles.join(", ")}`,
  ].join("\n");
}

export const listJobsForEmbedding = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("jobListings"),
      text: v.string(),
    }),
  ),
  handler: async (ctx) => {
    // Small seeded dataset (~20 rows), so collecting everything is fine here.
    const jobs = await ctx.db.query("jobListings").collect();
    return jobs.map((job) => ({ _id: job._id, text: jobEmbeddingText(job) }));
  },
});

export const listProfilesForEmbedding = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("profiles"),
      text: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles.map((profile) => ({
      _id: profile._id,
      text: profileEmbeddingText(profile),
    }));
  },
});

export const patchJobEmbedding = internalMutation({
  args: {
    jobId: v.id("jobListings"),
    embedding: v.array(v.float64()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, { embedding: args.embedding });
    return null;
  },
});

export const patchProfileEmbedding = internalMutation({
  args: {
    profileId: v.id("profiles"),
    embedding: v.array(v.float64()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, { embedding: args.embedding });
    return null;
  },
});

/**
 * Embed every job listing and profile, and persist the vectors.
 * Run after seeding: `npx convex run embeddings:backfill`
 */
export const backfill = internalAction({
  args: {},
  returns: v.object({
    jobsEmbedded: v.number(),
    profilesEmbedded: v.number(),
  }),
  handler: async (
    ctx,
  ): Promise<{ jobsEmbedded: number; profilesEmbedded: number }> => {
    // Explicit annotations break circular type inference (action and the
    // internal functions it calls live in the same file).
    const jobs: Array<{ _id: Id<"jobListings">; text: string }> =
      await ctx.runQuery(internal.embeddings.listJobsForEmbedding, {});
    if (jobs.length > 0) {
      const jobEmbeddings = await embedTexts(jobs.map((job) => job.text));
      for (let i = 0; i < jobs.length; i++) {
        await ctx.runMutation(internal.embeddings.patchJobEmbedding, {
          jobId: jobs[i]._id,
          embedding: jobEmbeddings[i],
        });
      }
    }

    const profiles: Array<{ _id: Id<"profiles">; text: string }> =
      await ctx.runQuery(internal.embeddings.listProfilesForEmbedding, {});
    if (profiles.length > 0) {
      const profileEmbeddings = await embedTexts(
        profiles.map((profile) => profile.text),
      );
      for (let i = 0; i < profiles.length; i++) {
        await ctx.runMutation(internal.embeddings.patchProfileEmbedding, {
          profileId: profiles[i]._id,
          embedding: profileEmbeddings[i],
        });
      }
    }

    return { jobsEmbedded: jobs.length, profilesEmbedded: profiles.length };
  },
});
