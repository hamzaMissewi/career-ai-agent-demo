import { defineTool } from "eve/tools";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { getConvexClient, resolveCandidateClerkId } from "../lib/convex";

export default defineTool({
  description:
    "Save a job listing to the candidate's saved jobs list for later review. " +
    "Use when the user wants to bookmark, save, or shortlist a job.",
  inputSchema: z.object({
    jobId: z.string().describe("The id of the job listing to save"),
  }),
  async execute(ctx, { jobId }) {
    const clerkUserId = await resolveCandidateClerkId(ctx);
    const result = await getConvexClient().mutation(api.savedJobs.save, {
      clerkUserId,
      jobId: jobId as any,
    });
    return {
      saved: result.saved,
      message: result.saved
        ? "Job saved to your list. View all saved jobs at /saved."
        : "Job is already in your saved list.",
    };
  },
});
