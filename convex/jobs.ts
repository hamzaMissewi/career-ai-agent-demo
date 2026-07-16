import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";
import {
  employmentTypeValidator,
  jobStatusValidator,
  seniorityValidator,
} from "./schema";

/** Public shape of a job listing (embedding vector stripped). */
export const publicJobValidator = v.object({
  _id: v.id("jobListings"),
  _creationTime: v.number(),
  title: v.string(),
  company: v.string(),
  location: v.string(),
  remote: v.boolean(),
  employmentType: employmentTypeValidator,
  seniority: seniorityValidator,
  salaryMin: v.optional(v.number()),
  salaryMax: v.optional(v.number()),
  description: v.string(),
  requirements: v.array(v.string()),
  skills: v.array(v.string()),
  status: jobStatusValidator,
  postedAt: v.number(),
});

export function toPublicJob(job: Doc<"jobListings">) {
  return {
    _id: job._id,
    _creationTime: job._creationTime,
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.remote,
    employmentType: job.employmentType,
    seniority: job.seniority,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    description: job.description,
    requirements: job.requirements,
    skills: job.skills,
    status: job.status,
    postedAt: job.postedAt,
  };
}

/** Paginated list of open job listings, newest first. */
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(publicJobValidator),
    isDone: v.boolean(),
    continueCursor: v.string(),
    splitCursor: v.optional(v.union(v.string(), v.null())),
    pageStatus: v.optional(
      v.union(
        v.literal("SplitRecommended"),
        v.literal("SplitRequired"),
        v.null(),
      ),
    ),
  }),
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("jobListings")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .paginate(args.paginationOpts);
    return { ...result, page: result.page.map(toPublicJob) };
  },
});

/** Full-text search over open job descriptions. */
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(publicJobValidator),
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 10, 50);
    const results = await ctx.db
      .query("jobListings")
      .withSearchIndex("search_description", (q) =>
        q.search("description", args.query).eq("status", "open"),
      )
      .take(limit);
    return results.map(toPublicJob);
  },
});

/** Fetch a single job listing by id. */
export const get = query({
  args: { jobId: v.id("jobListings") },
  returns: v.union(publicJobValidator, v.null()),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    return job ? toPublicJob(job) : null;
  },
});
