import { defineTool } from "eve/tools";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "../lib/convex";

export default defineTool({
  description:
    "Full-text search over open job listings. Use for keyword or topic " +
    "queries like 'react frontend', 'machine learning', or 'devops kubernetes'. " +
    "Returns matching jobs with title, company, location, salary, and skills.",
  inputSchema: z.object({
    query: z.string().min(1).describe("Keywords to search job descriptions"),
    limit: z.number().int().min(1).max(20).optional(),
  }),
  async execute({ query, limit }) {
    const jobs = await getConvexClient().query(api.jobs.search, {
      query,
      limit: limit ?? 8,
    });
    return {
      count: jobs.length,
      jobs: jobs.map((job) => ({
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        employmentType: job.employmentType,
        seniority: job.seniority,
        salaryMin: job.salaryMin ?? null,
        salaryMax: job.salaryMax ?? null,
        skills: job.skills,
        // Cards and the model both only need a preview of the description.
        descriptionPreview:
          job.description.length > 240
            ? `${job.description.slice(0, 240)}…`
            : job.description,
      })),
    };
  },
});
