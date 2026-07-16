import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { SessionContext } from "eve/tools";

/** Clerk user id of the seeded demo candidate (see convex/seed.ts). */
export const DEMO_CLERK_USER_ID = "user_demo_candidate";

let client: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev --once` to provision it.",
      );
    }
    client = new ConvexHttpClient(url);
  }
  return client;
}

/**
 * Resolve which candidate profile to use for this session: the signed-in
 * Clerk user when they have a profile in Convex, otherwise the seeded demo
 * candidate so the agent stays testable from local dev and the TUI.
 */
export async function resolveCandidateClerkId(
  ctx: SessionContext,
): Promise<string> {
  const caller = ctx.session.auth.current;
  if (caller?.principalType === "user" && caller.authenticator === "clerk") {
    const profile = await getConvexClient().query(api.profiles.getByClerkId, {
      clerkUserId: caller.principalId,
    });
    if (profile) {
      return caller.principalId;
    }
  }
  return DEMO_CLERK_USER_ID;
}
