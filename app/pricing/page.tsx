import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Choose a plan
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Chatting with the Career AI Agent requires the Pro plan.
        </p>
      </div>
      <div className="w-full max-w-4xl">
        <PricingTable newSubscriptionRedirectUrl="/chat" />
      </div>
    </div>
  );
}
