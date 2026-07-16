"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function formatSalary(min: number | null, max: number | null): string | null {
  const compact = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min != null && max != null) return `${compact(min)}–${compact(max)}`;
  if (min != null) return `from ${compact(min)}`;
  if (max != null) return `up to ${compact(max)}`;
  return null;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/8 px-2 py-0.5 text-[11px] font-medium capitalize text-zinc-600 dark:border-white/[.145] dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function SavedJobsPage() {
  const { user, isLoaded } = useUser();
  const savedJobs = useQuery(
    api.savedJobs.listSavedJobs,
    user ? { clerkUserId: user.id } : "skip",
  );
  const unsave = useMutation(api.savedJobs.unsave);

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to view your saved jobs.
        </p>
        <Link
          href="/sign-in"
          className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (savedJobs === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-400">Loading saved jobs…</p>
      </div>
    );
  }

  const handleUnsave = async (jobId: string) => {
    await unsave({
      clerkUserId: user.id,
      jobId: jobId as Id<"jobListings">,
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {savedJobs.length === 0
                ? "No saved jobs yet."
                : `${savedJobs.length} job${savedJobs.length === 1 ? "" : "s"} saved`}
            </p>
          </div>
          <Link
            href="/chat"
            className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Open Chat
          </Link>
        </div>

        {savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/15 py-16 dark:border-white/15">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You haven't saved any jobs yet.
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Use the ☆ Save button on job cards in the chat, or ask the agent
              to save a job for you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map(({ savedAt, job }) => {
              const salary = formatSalary(job.salaryMin, job.salaryMax);
              return (
                <div
                  key={job._id}
                  className="flex flex-col gap-2 rounded-xl border border-black/8 bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-zinc-950"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold leading-5">
                        {job.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {job.company}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleUnsave(job._id)}
                      className="shrink-0 rounded-full border border-amber-300 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-500/20"
                    >
                      ★ Saved
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {job.location && <Badge>{job.location}</Badge>}
                    {job.remote && <Badge>Remote</Badge>}
                    {job.seniority && <Badge>{job.seniority}</Badge>}
                    {job.employmentType && (
                      <Badge>{job.employmentType}</Badge>
                    )}
                    {salary && <Badge>{salary}</Badge>}
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 8).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-black/4 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-white/8 dark:text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Saved{" "}
                    {new Date(savedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
