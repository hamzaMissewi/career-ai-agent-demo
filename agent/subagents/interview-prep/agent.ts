import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Prepare candidates for interviews. Generate relevant interview questions, provide answer frameworks, and offer tips for specific roles and companies.",
  model: "anthropic/claude-sonnet-5",
});
