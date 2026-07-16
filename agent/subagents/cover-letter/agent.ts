import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Generate tailored cover letters for specific job applications. Creates personalized cover letters based on the candidate's profile and job requirements.",
  model: "anthropic/claude-sonnet-5",
});
