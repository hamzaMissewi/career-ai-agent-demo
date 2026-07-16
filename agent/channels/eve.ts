import { createClerkClient } from "@clerk/backend";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

/**
 * Authenticates browser requests using the Clerk session cookie (or bearer
 * token). Returns a user principal so user-scoped connections can bind OAuth
 * grants to the signed-in Clerk user.
 *
 * Chatting with the agent is a Pro-only feature, so Clerk sessions must also
 * pass a Clerk Billing `has({ plan: "pro" })` entitlement check.
 */
function clerkSession(): AuthFn<Request> {
  return async (request) => {
    const requestState = await clerkClient.authenticateRequest(request);
    if (!requestState.isAuthenticated) return null; // skip; fall through

    const auth = requestState.toAuth();
    if (!auth.userId) return null;

    // Clerk Billing gate: signed-in users without the Pro plan are rejected
    // here rather than falling through to the deploy/local-dev authenticators.
    if (!auth.has({ plan: "pro" })) return null;

    const attributes: Record<string, string> = {};
    if (auth.sessionId) {
      attributes.sessionId = auth.sessionId;
    }

    return {
      authenticator: "clerk",
      principalId: auth.userId,
      principalType: "user",
      attributes,
    };
  };
}

export default eveChannel({
  auth: [
    // App users signed in through Clerk.
    clerkSession(),
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
  ],
});
