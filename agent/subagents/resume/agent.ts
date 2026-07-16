import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Analyze and improve resumes. Review candidate profiles, suggest improvements, identify skill gaps, and provide actionable feedback for career advancement.",
  model: "anthropic/claude-sonnet-5",
});
