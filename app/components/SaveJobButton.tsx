"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function useSavedJobIds(): Set<string> {
  const { user } = useUser();
  const savedJobIds = useQuery(
    api.savedJobs.savedJobIds,
    user ? { clerkUserId: user.id } : "skip",
  );
  return new Set(savedJobIds ?? []);
}

export function SaveJobButton({
  jobId,
  saved,
}: {
  jobId: string;
  saved: boolean;
}) {
  const { user } = useUser();
  const save = useMutation(api.savedJobs.save);
  const unsave = useMutation(api.savedJobs.unsave);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return null;
  }

  const toggle = async () => {
    setIsSaving(true);
    try {
      if (saved) {
        await unsave({
          clerkUserId: user.id,
          jobId: jobId as Id<"jobListings">,
        });
      } else {
        await save({
          clerkUserId: user.id,
          jobId: jobId as Id<"jobListings">,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={isSaving}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        saved
          ? "border-amber-300 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-500/20"
          : "border-black/8 text-zinc-500 hover:bg-black/4 dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/8"
      }`}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
