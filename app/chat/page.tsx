import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AgentChat } from "../components/AgentChat";

export default async function ChatPage() {
  // Clerk Billing entitlement check — chat is a Pro-only feature.
  const { has } = await auth();
  if (!has({ plan: "pro" })) {
    redirect("/pricing");
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-[calc(100vh-4rem)] w-full max-w-3xl flex-col bg-white dark:bg-black">
        <AgentChat />
      </main>
    </div>
  );
}
