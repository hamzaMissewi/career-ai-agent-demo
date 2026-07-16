import { defineTool } from "eve/tools";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { getConvexClient, resolveCandidateClerkId } from "../lib/convex";

export default defineTool({
  description:
    "Write a tailored cover letter for a specific job listing based on the " +
    "candidate's profile. Pass the jobId from a previous search_jobs or " +
    "find_matches result. Returns the drafted letter for the candidate to " +
    "review and edit.",
  inputSchema: z.object({
    jobId: z
      .string()
      .min(1)
      .describe("The jobId of the listing to write a cover letter for"),
  }),
  async execute({ jobId }, ctx) {
    const clerkUserId = await resolveCandidateClerkId(ctx);
    const result = await getConvexClient().action(api.coverLetters.generate, {
      clerkUserId,
      jobId: jobId as Id<"jobListings">,
    });
    return {
      jobId,
      title: result.title,
      company: result.company,
      coverLetter: result.coverLetter,
    };
  },
});
