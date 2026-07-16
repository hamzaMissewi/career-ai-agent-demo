import { generateText } from "ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalQuery } from "./_generated/server";

const COVER_LETTER_MODEL = "anthropic/claude-sonnet-5"; // via Vercel AI Gateway

type CandidateInfo = {
  name: string;
  headline: string;
  summary: string;
  skills: string[];
  yearsOfExperience: number;
  experience: {
    company: string;
    role: string;
    startYear: number;
    endYear?: number;
    description: string;
  }[];
};

type JobInfo = {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
};

export const getCandidateForCoverLetter = internalQuery({
  args: { clerkUserId: v.string() },
  returns: v.union(
    v.object({
      name: v.string(),
      headline: v.string(),
      summary: v.string(),
      skills: v.array(v.string()),
      yearsOfExperience: v.number(),
      experience: v.array(
        v.object({
          company: v.string(),
          role: v.string(),
          startYear: v.number(),
          endYear: v.optional(v.number()),
          description: v.string(),
        }),
      ),
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
      name: user.name,
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      yearsOfExperience: profile.yearsOfExperience,
      experience: profile.experience,
    };
  },
});

export const getJobForCoverLetter = internalQuery({
  args: { jobId: v.id("jobListings") },
  returns: v.union(
    v.object({
      title: v.string(),
      company: v.string(),
      description: v.string(),
      requirements: v.array(v.string()),
      skills: v.array(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      return null;
    }
    return {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
    };
  },
});

/**
 * Draft a tailored cover letter for a candidate and job using the LLM.
 * Used by both the chat agent's `write_cover_letter` tool and the
 * "Apply for this job" dialog in the UI.
 */
export const generate = action({
  args: {
    clerkUserId: v.string(),
    jobId: v.id("jobListings"),
  },
  returns: v.object({
    coverLetter: v.string(),
    title: v.string(),
    company: v.string(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ coverLetter: string; title: string; company: string }> => {
    // Explicit annotations break circular type inference (action and the
    // internal functions it calls live in the same file).
    const candidate: CandidateInfo | null = await ctx.runQuery(
      internal.coverLetters.getCandidateForCoverLetter,
      { clerkUserId: args.clerkUserId },
    );
    if (!candidate) {
      throw new Error(`No profile found for Clerk user ${args.clerkUserId}`);
    }
    const job: JobInfo | null = await ctx.runQuery(
      internal.coverLetters.getJobForCoverLetter,
      { jobId: args.jobId },
    );
    if (!job) {
      throw new Error("Job listing not found");
    }

    const experienceLines = candidate.experience
      .map(
        (e) =>
          `- ${e.role} at ${e.company} (${e.startYear}–${e.endYear ?? "present"}): ${e.description}`,
      )
      .join("\n");

    const { text } = await generateText({
      model: COVER_LETTER_MODEL,
      prompt: [
        "Write a concise, compelling cover letter (220-300 words) for the candidate below applying to the job below.",
        "Rules: professional but warm tone; first person; reference 2-3 specific overlaps between the candidate's experience/skills and the job's requirements; no placeholder brackets; no address headers; start with 'Dear Hiring Team,' and end with the candidate's name; plain text only, no markdown.",
        "",
        `## Candidate`,
        `Name: ${candidate.name}`,
        `Headline: ${candidate.headline}`,
        `Years of experience: ${candidate.yearsOfExperience}`,
        `Summary: ${candidate.summary}`,
        `Skills: ${candidate.skills.join(", ")}`,
        `Experience:\n${experienceLines}`,
        "",
        `## Job`,
        `Title: ${job.title}`,
        `Company: ${job.company}`,
        `Description: ${job.description}`,
        `Requirements: ${job.requirements.join("; ")}`,
        `Skills: ${job.skills.join(", ")}`,
      ].join("\n"),
    });

    return { coverLetter: text.trim(), title: job.title, company: job.company };
  },
});
