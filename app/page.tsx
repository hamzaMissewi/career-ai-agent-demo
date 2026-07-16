import { PricingTable, Show, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

const features = [
  {
    title: "Smart job search",
    description:
      "Search thousands of curated job listings by title, company, or keyword — straight from the chat.",
  },
  {
    title: "AI-powered matching",
    description:
      "Vector similarity matching ranks roles against your profile so the best-fit jobs surface first.",
  },
  {
    title: "Career copilot chat",
    description:
      "A conversational agent that finds roles, compares offers, and helps you plan your next move.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pb-20 pt-24 text-center">
        <span className="mb-6 rounded-full border border-black/8 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-white/[.145] dark:text-zinc-400">
          Demo — Career AI Agent
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Land your next role with an AI career copilot
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
          Chat with an agent that searches live job listings, matches them to
          your profile, and guides your career decisions — all in one
          conversation.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Show when="signed-out">
            <SignUpButton>
              <button className="h-11 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
                Get started free
              </button>
            </SignUpButton>
            <a
              href="#pricing"
              className="h-11 rounded-full border border-black/8 px-6 text-sm font-medium leading-[2.75rem] transition-colors hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-white/8"
            >
              View pricing
            </a>
          </Show>

          <Show when="signed-in">
            <Show
              when={{ plan: "pro" }}
              fallback={
                <>
                  <a
                    href="#pricing"
                    className="h-11 rounded-full bg-foreground px-6 text-sm font-medium leading-[2.75rem] text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  >
                    Upgrade to Pro
                  </a>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Pro unlocks the AI agent chat
                  </span>
                </>
              }
            >
              <Link
                href="/chat"
                className="h-11 rounded-full bg-foreground px-6 text-sm font-medium leading-[2.75rem] text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Open the chat
              </Link>
            </Show>
          </Show>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-black/8 bg-white p-6 dark:border-white/[.145] dark:bg-black"
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-4xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Go Pro to chat with the Career AI Agent.
          </p>
        </div>
        <PricingTable newSubscriptionRedirectUrl="/chat" />
      </section>

      <footer className="border-t border-black/8 py-8 text-center text-xs text-zinc-400 dark:border-white/[.145]">
        Career AI Agent — demo application
      </footer>
    </div>
  );
}
