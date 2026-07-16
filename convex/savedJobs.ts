import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { toPublicJob } from "./jobs";

/** List of job ids the user has saved (for bookmark badges). */
export const savedJobIds = query({
  args: { clerkUserId: v.string() },
  returns: v.array(v.id("jobListings")),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      return [];
    }
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return saved.map((s) => s.jobId);
  },
});

/** Full details of saved jobs for the dashboard page. */
export const listSavedJobs = query({
  args: { clerkUserId: v.string() },
  returns: v.array(
    v.object({
      savedAt: v.number(),
      job: v.object({
        _id: v.id("jobListings"),
        _creationTime: v.number(),
        title: v.string(),
        company: v.string(),
        location: v.string(),
        remote: v.boolean(),
        employmentType: v.string(),
        seniority: v.string(),
        salaryMin: v.optional(v.number()),
        salaryMax: v.optional(v.number()),
        description: v.string(),
        requirements: v.array(v.string()),
        skills: v.array(v.string()),
        status: v.string(),
        postedAt: v.number(),
      }),
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
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const results = [];
    for (const s of saved) {
      const job = await ctx.db.get(s.jobId);
      if (job && job.status === "open") {
        results.push({ savedAt: s.savedAt, job: toPublicJob(job) });
      }
    }
    return results;
  },
});

/** Save a job for the user. Idempotent — re-saving is a no-op. */
export const save = mutation({
  args: {
    clerkUserId: v.string(),
    jobId: v.id("jobListings"),
  },
  returns: v.object({ saved: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      throw new Error(
        "No candidate found for this account. Seed a profile first.",
      );
    }
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job listing not found");
    }

    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", user._id).eq("jobId", args.jobId),
      )
      .unique();

    if (existing) {
      return { saved: true };
    }

    await ctx.db.insert("savedJobs", {
      userId: user._id,
      jobId: args.jobId,
      savedAt: Date.now(),
    });
    return { saved: true };
  },
});

/** Remove a saved job for the user. Idempotent — unsaving twice is a no-op. */
export const unsave = mutation({
  args: {
    clerkUserId: v.string(),
    jobId: v.id("jobListings"),
  },
  returns: v.object({ saved: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      return { saved: false };
    }

    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", user._id).eq("jobId", args.jobId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return { saved: false };
  },
});
