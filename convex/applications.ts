import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Job listing ids the user has already applied to (for card badges). */
export const appliedJobIds = query({
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
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return applications
      .filter((application) => application.status !== "saved")
      .map((application) => application.jobId);
  },
});

/**
 * Submit an application with a cover letter on the candidate's behalf.
 * Stores the letter in `coverLetters` and upserts the application row.
 */
export const submit = mutation({
  args: {
    clerkUserId: v.string(),
    jobId: v.id("jobListings"),
    coverLetter: v.string(),
  },
  returns: v.object({ applicationId: v.id("applications") }),
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
    if (job.status !== "open") {
      throw new Error("This job listing is no longer open");
    }
    if (args.coverLetter.trim().length === 0) {
      throw new Error("Cover letter cannot be empty");
    }

    const now = Date.now();
    const coverLetterId = await ctx.db.insert("coverLetters", {
      userId: user._id,
      jobId: args.jobId,
      content: args.coverLetter.trim(),
      createdAt: now,
    });

    const existing = await ctx.db
      .query("applications")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", user._id).eq("jobId", args.jobId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "applied",
        coverLetterId,
        updatedAt: now,
      });
      return { applicationId: existing._id };
    }

    const applicationId = await ctx.db.insert("applications", {
      userId: user._id,
      jobId: args.jobId,
      status: "applied",
      coverLetterId,
      updatedAt: now,
    });
    return { applicationId };
  },
});
