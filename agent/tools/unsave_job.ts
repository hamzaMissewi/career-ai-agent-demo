import { defineTool } from "eve/tools";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { getConvexClient, resolveCandidateClerkId } from "../lib/convex";

export default defineTool({
  description:
    "Remove a job from the candidate's saved jobs list. " +
    "Use when the user wants to unsave, remove, or delete a saved job.",
  inputSchema: z.object({
    jobId: z.string().describe("The id of the job listing to unsave"),
  }),
  async execute(ctx, { jobId }) {
    const clerkUserId = await resolveCandidateClerkId(ctx);
    const result = await getConvexClient().mutation(api.savedJobs.unsave, {
      clerkUserId,
      jobId: jobId as any,
    });
    return {
      saved: result.saved,
      message: result.saved
        ? "Job removed from your saved list."
        : "Job was not in your saved list.",
    };
  },
});
