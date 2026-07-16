import { defineTool } from "eve/tools";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { getConvexClient, resolveCandidateClerkId } from "../lib/convex";

export default defineTool({
  description:
    "Find the open job listings that best match the candidate's profile " +
    "using vector-embedding similarity. Returns jobs ranked by a 0-100 match " +
    "percentage with matched and missing skills. Use whenever the candidate " +
    "asks which jobs suit them or how well they match a role.",
  inputSchema: z.object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Max matches to return (default 8)"),
  }),
  async execute({ limit }, ctx) {
    const convex = getConvexClient();
    const clerkUserId = await resolveCandidateClerkId(ctx);

    const matches = await convex.action(api.matches.findSimilarJobs, {
      clerkUserId,
      limit: limit ?? 8,
    });

    // Join full job details so the UI can render rich match cards.
    const jobs = await Promise.all(
      matches.map((match) => convex.query(api.jobs.get, { jobId: match.jobId })),
    );
    const jobById = new Map(
      jobs.filter((job) => job !== null).map((job) => [job._id, job]),
    );

    return {
      clerkUserId,
      count: matches.length,
      matches: matches.map((match) => {
        const job = jobById.get(match.jobId);
        return {
          jobId: match.jobId,
          title: match.title,
          company: match.company,
          score: match.score,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          reasoning: match.reasoning,
          location: job?.location ?? null,
          remote: job?.remote ?? null,
          seniority: job?.seniority ?? null,
          employmentType: job?.employmentType ?? null,
          salaryMin: job?.salaryMin ?? null,
          salaryMax: job?.salaryMax ?? null,
        };
      }),
    };
  },
});
