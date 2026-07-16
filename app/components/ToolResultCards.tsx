"use client";

import { ApplyButton, useAppliedJobIds } from "./ApplyButton";
import { SaveJobButton, useSavedJobIds } from "./SaveJobButton";

type JobCardData = {
  jobId: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean | null;
  employmentType: string | null;
  seniority: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  skills?: string[];
  descriptionPreview?: string;
};

type MatchCardData = JobCardData & {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
};

export type SearchJobsOutput = {
  count: number;
  jobs: JobCardData[];
};

export type FindMatchesOutput = {
  count: number;
  matches: MatchCardData[];
};

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

function SkillChip({
  skill,
  tone,
}: {
  skill: string;
  tone: "default" | "matched" | "missing";
}) {
  const toneClasses =
    tone === "matched"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : tone === "missing"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-black/4 text-zinc-600 dark:bg-white/8 dark:text-zinc-300";
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${toneClasses}`}
    >
      {skill}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-emerald-500"
      : score >= 55
        ? "text-amber-500"
        : "text-zinc-400";
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-11 w-11 shrink-0">
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-black/8 dark:stroke-white/10"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className={`${color} stroke-current`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">
        {score}%
      </span>
    </div>
  );
}

function JobMeta({ job }: { job: JobCardData }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {job.location && <Badge>{job.location}</Badge>}
      {job.remote && <Badge>Remote</Badge>}
      {job.seniority && <Badge>{job.seniority}</Badge>}
      {job.employmentType && <Badge>{job.employmentType}</Badge>}
      {salary && <Badge>{salary}</Badge>}
    </div>
  );
}

export function JobSearchResults({ output }: { output: SearchJobsOutput }) {
  const appliedJobIds = useAppliedJobIds();
  const savedJobIds = useSavedJobIds();
  if (output.jobs.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No open jobs matched that search.
      </p>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {output.jobs.map((job) => (
        <div
          key={job.jobId}
          className="flex flex-col gap-2 rounded-xl border border-black/8 bg-white p-3.5 shadow-sm dark:border-white/[.145] dark:bg-zinc-950"
        >
          <div>
            <p className="text-sm font-semibold leading-5">{job.title}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {job.company}
            </p>
          </div>
          <JobMeta job={job} />
          {job.descriptionPreview && (
            <p className="line-clamp-3 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              {job.descriptionPreview}
            </p>
          )}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 6).map((skill) => (
                <SkillChip key={skill} skill={skill} tone="default" />
              ))}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2 pt-1">
            <SaveJobButton
              jobId={job.jobId}
              saved={savedJobIds.has(job.jobId)}
            />
            <ApplyButton
              jobId={job.jobId}
              title={job.title}
              company={job.company}
              applied={appliedJobIds.has(job.jobId)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MatchResults({ output }: { output: FindMatchesOutput }) {
  const appliedJobIds = useAppliedJobIds();
  const savedJobIds = useSavedJobIds();
  if (output.matches.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No matches found — try updating the profile first.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {output.matches.map((match) => (
        <div
          key={match.jobId}
          className="flex gap-3 rounded-xl border border-black/8 bg-white p-3.5 shadow-sm dark:border-white/[.145] dark:bg-zinc-950"
        >
          <ScoreRing score={match.score} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div>
              <p className="text-sm font-semibold leading-5">{match.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {match.company}
              </p>
            </div>
            <JobMeta job={match} />
            {(match.matchedSkills.length > 0 ||
              match.missingSkills.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {match.matchedSkills.map((skill) => (
                  <SkillChip key={skill} skill={skill} tone="matched" />
                ))}
                {match.missingSkills.map((skill) => (
                  <SkillChip key={skill} skill={skill} tone="missing" />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 pt-1">
              <SaveJobButton
                jobId={match.jobId}
                saved={savedJobIds.has(match.jobId)}
              />
              <ApplyButton
                jobId={match.jobId}
                title={match.title}
                company={match.company}
                applied={appliedJobIds.has(match.jobId)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
