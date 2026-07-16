"use client";

import { useUser } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function useAppliedJobIds(): Set<string> {
  const { user } = useUser();
  const appliedJobIds = useQuery(
    api.applications.appliedJobIds,
    user ? { clerkUserId: user.id } : "skip",
  );
  return new Set(appliedJobIds ?? []);
}

export function ApplyButton({
  jobId,
  title,
  company,
  applied,
}: {
  jobId: string;
  title: string;
  company: string;
  applied: boolean;
}) {
  const { user } = useUser();
  const generate = useAction(api.coverLetters.generate);
  const submit = useMutation(api.applications.submit);

  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (applied) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
        ✓ Applied
      </span>
    );
  }

  if (!user) {
    return null;
  }

  const openAndGenerate = async () => {
    setOpen(true);
    setError(null);
    setCoverLetter("");
    setGenerating(true);
    try {
      const result = await generate({
        clerkUserId: user.id,
        jobId: jobId as Id<"jobListings">,
      });
      setCoverLetter(result.coverLetter);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to draft cover letter",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submit({
        clerkUserId: user.id,
        jobId: jobId as Id<"jobListings">,
        coverLetter,
      });
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="h-7 rounded-full px-3 text-xs"
        onClick={() => void openAndGenerate()}
      >
        Apply for this job
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Apply to {title} @ {company}
            </DialogTitle>
            <DialogDescription>
              {generating
                ? "Drafting a tailored cover letter from your profile…"
                : "Review and edit your cover letter, then submit your application."}
            </DialogDescription>
          </DialogHeader>

          {generating ? (
            <div className="space-y-2 py-2" aria-hidden>
              <div className="h-3 w-full animate-pulse rounded bg-black/8 dark:bg-white/10" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-black/8 dark:bg-white/10" />
              <div className="h-3 w-full animate-pulse rounded bg-black/8 dark:bg-white/10" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-black/8 dark:bg-white/10" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-black/8 dark:bg-white/10" />
            </div>
          ) : (
            <Textarea
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              rows={14}
              className="max-h-[50vh] min-h-64 text-sm leading-6"
              placeholder="Your cover letter…"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={generating || submitting || coverLetter.trim() === ""}
            >
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
