import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const employmentTypeValidator = v.union(
  v.literal("full_time"),
  v.literal("part_time"),
  v.literal("contract"),
);

export const seniorityValidator = v.union(
  v.literal("junior"),
  v.literal("mid"),
  v.literal("senior"),
  v.literal("staff"),
);

export const jobStatusValidator = v.union(
  v.literal("open"),
  v.literal("closed"),
);

export const applicationStatusValidator = v.union(
  v.literal("saved"),
  v.literal("applied"),
  v.literal("interviewing"),
  v.literal("offer"),
  v.literal("rejected"),
);

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    name: v.string(),
    email: v.string(),
  }).index("by_clerk_id", ["clerkUserId"]),

  profiles: defineTable({
    userId: v.id("users"),
    headline: v.string(),
    summary: v.string(),
    skills: v.array(v.string()),
    yearsOfExperience: v.number(),
    location: v.string(),
    desiredRoles: v.array(v.string()),
    openToRemote: v.boolean(),
    experience: v.array(
      v.object({
        company: v.string(),
        role: v.string(),
        startYear: v.number(),
        endYear: v.optional(v.number()),
        description: v.string(),
      }),
    ),
    education: v.array(
      v.object({
        school: v.string(),
        degree: v.string(),
        year: v.number(),
      }),
    ),
    embedding: v.optional(v.array(v.float64())),
  }).index("by_user", ["userId"]),

  jobListings: defineTable({
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
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_status", ["status"])
    .index("by_company", ["company"])
    .searchIndex("search_description", {
      searchField: "description",
      filterFields: ["status"],
    })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["status"],
    }),

  matches: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    score: v.number(),
    matchedSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    reasoning: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobId"]),

  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    isPrimary: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  coverLetters: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"]),

  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    status: applicationStatusValidator,
    coverLetterId: v.optional(v.id("coverLetters")),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobId"]),

  savedJobs: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    savedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_job", ["userId", "jobId"]),
});
