import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Search and match job opportunities. Find open positions using keyword searches or profile-based similarity matching with skill analysis and match percentages.",
  model: "anthropic/claude-sonnet-5",
});
