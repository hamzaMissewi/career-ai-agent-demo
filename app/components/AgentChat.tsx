"use client";

import { useEveAgent } from "eve/react";
import type { EveMessagePart } from "eve/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  JobSearchResults,
  MatchResults,
  type FindMatchesOutput,
  type SearchJobsOutput,
} from "./ToolResultCards";

const TOOL_LABELS: Record<string, string> = {
  search_jobs: "Searching job listings",
  find_matches: "Matching jobs to your profile",
};

function ToolPart({
  part,
}: {
  part: Extract<EveMessagePart, { type: "dynamic-tool" }>;
}) {
  if (part.state === "output-available") {
    if (part.toolName === "search_jobs") {
      return <JobSearchResults output={part.output as SearchJobsOutput} />;
    }
    if (part.toolName === "find_matches") {
      return <MatchResults output={part.output as FindMatchesOutput} />;
    }
    return (
      <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
        ✓ {part.toolName}
      </p>
    );
  }
  if (part.state === "output-error") {
    return (
      <p className="text-xs text-red-500">
        {part.toolName} failed: {part.errorText}
      </p>
    );
  }
  return (
    <p className="animate-pulse text-xs text-zinc-500 dark:text-zinc-400">
      {TOOL_LABELS[part.toolName] ?? `Running ${part.toolName}`}…
    </p>
  );
}

export function AgentChat() {
  const agent = useEveAgent();
  const [input, setInput] = useState("");
  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (message.length === 0 || isBusy) return;
    setInput("");
    void agent.send({ message });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {agent.data.messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              Career AI Agent
            </h2>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Ask me to find jobs that match your profile, search listings, or
              help with your resume and cover letters.
            </p>
          </div>
        )}

        {agent.data.messages.map((message) => (
          <article key={message.id} className="flex flex-col gap-2">
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                        message.role === "user"
                          ? "whitespace-pre-wrap bg-foreground text-background"
                          : "bg-black/4 dark:bg-white/8"
                      }`}
                    >
                      {message.role === "user" ? (
                        part.text
                      ) : (
                        <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              if (part.type === "dynamic-tool") {
                return <ToolPart key={index} part={part} />;
              }
              return null;
            })}
          </article>
        ))}

        {agent.status === "submitted" && (
          <p className="text-sm text-zinc-400">Thinking…</p>
        )}
        {agent.error && (
          <p className="text-sm text-red-500">{agent.error.message}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-black/8 p-4 dark:border-white/[.145]"
      >
        <input
          name="message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about jobs, matches, or your resume…"
          autoComplete="off"
          className="h-11 flex-1 rounded-full border border-black/8 bg-transparent px-4 text-sm outline-none placeholder:text-zinc-400 focus:border-black/24 dark:border-white/[.145] dark:focus:border-white/40"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={() => void agent.stop()}
            className="h-11 rounded-full border border-black/8 px-5 text-sm font-medium transition-colors hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-white/8"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={input.trim().length === 0}
            className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-40 dark:hover:bg-[#ccc]"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
