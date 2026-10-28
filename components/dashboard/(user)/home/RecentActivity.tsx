"use client";

import React from "react";
import { Activity, BookOpen, Library, Sparkles } from "lucide-react";
import {
  ActivityHistoryItem,
  ActivityResume,
  useGetActivityHistoryQuery,
  useGetActivityResumeQuery,
} from "@/lib/redux/api/activityApi";
import { RecentResourcesSkeleton } from "./UserDashboardSkeleton";

const sourceIcon = (source: string) => {
  if (source === "ACADEMY") return BookOpen;
  if (source === "LIBRARY") return Library;
  return Sparkles;
};

const formatDuration = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds || 0));
  if (safe < 60) return `${safe}s`;
  const minutes = Math.round(safe / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem ? `${hours}h ${rem}m` : `${hours}h`;
};

const formatWhen = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const labelFor = (item: ActivityHistoryItem | ActivityResume) => {
  if (item.resourceLabel) return item.resourceLabel;
  if (item.aiToolId) return String(item.aiToolId).replace(/_/g, " ");
  if (item.source === "ACADEMY") return "Academy session";
  if (item.source === "LIBRARY") return "Library session";
  return "AI tool session";
};

/**
 * Last-visited pointer + recent heartbeat sessions.
 * This is a history pointer — not a full workflow restore.
 */
export function RecentActivity() {
  const {
    data: resumeData,
    isLoading: resumeLoading,
    isError: resumeError,
  } = useGetActivityResumeQuery();
  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useGetActivityHistoryQuery({ page: 1, limit: 6 });

  const isLoading = resumeLoading || historyLoading;
  if (isLoading) {
    return <RecentResourcesSkeleton />;
  }

  const resume = resumeData?.data?.resume ?? null;
  const items = historyData?.data ?? [];

  return (
    <div className="ib-card h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Recent activity
        </h2>
      </div>

      {resumeError && historyError ? (
        <div className="py-10 text-center text-[var(--ib-mute)]">
          <Activity className="mx-auto mb-3 h-10 w-10 opacity-20" />
          <p className="text-sm">Unable to load activity right now.</p>
        </div>
      ) : !resume && items.length === 0 ? (
        <div className="py-10 text-center text-[var(--ib-mute)]">
          <Activity className="mx-auto mb-3 h-10 w-10 opacity-20" />
          <p className="text-sm">No tracked activity yet.</p>
          <p className="mt-1 text-xs">
            Time spent in Academy, Library, and AI tools will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {resume ? (
            <div className="rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-accbg)]/50 p-3.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--ib-acc)]">
                Last visited
              </p>
              <p className="truncate text-[14px] font-semibold text-[var(--ib-ink)]">
                {labelFor(resume)}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--ib-mute)]">
                {resume.source}
                {resume.updatedAt ? ` · ${formatWhen(resume.updatedAt)}` : ""}
              </p>
              <p className="mt-1 text-[11px] text-[var(--ib-mute)]">
                Pointer only — course progress still drives Continue Learning.
              </p>
            </div>
          ) : null}

          {items.map((item) => {
            const Icon = sourceIcon(item.source);
            return (
              <div
                key={item.sessionId}
                className="group flex items-center gap-3.5 rounded-[10px] border border-transparent bg-[var(--ib-bg)]/60 p-3.5 transition-all hover:border-[var(--ib-line)] hover:bg-[var(--ib-card)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[var(--ib-accbg)] text-[var(--ib-acc)]">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[14px] font-semibold text-[var(--ib-ink)]">
                    {labelFor(item)}
                  </h4>
                  <p className="text-[12px] text-[var(--ib-mute)]">
                    {item.source} · {formatDuration(item.activeSeconds)}
                    {item.lastSeenAt ? ` · ${formatWhen(item.lastSeenAt)}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
