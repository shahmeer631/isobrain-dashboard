"use client";

import React from "react";
import { Award, Sparkles, Target } from "lucide-react";
import {
  useGetXpMilestonesQuery,
  useGetXpSummaryQuery,
} from "@/lib/redux/api/xpApi";
import { SectionHeader } from "@/components/dashboard/design-system";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function GamificationPanel() {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetXpSummaryQuery();
  const {
    data: milestonesData,
    isLoading: milestonesLoading,
    isError: milestonesError,
  } = useGetXpMilestonesQuery();

  const isLoading = summaryLoading || milestonesLoading;
  const xpTotal = summaryData?.data?.xpTotal ?? 0;
  const recent = summaryData?.data?.recent ?? [];
  const milestones = milestonesData?.data ?? [];

  if (isLoading) {
    return (
      <div className="ib-card space-y-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (summaryError && milestonesError) {
    return (
      <div className="ib-card p-5 sm:p-6">
        <SectionHeader title="XP & milestones" className="mb-3" />
        <p className="text-sm text-[var(--ib-mute)]">
          Unable to load gamification data right now.
        </p>
      </div>
    );
  }

  return (
    <div className="ib-card space-y-5 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <SectionHeader title="XP & milestones" className="mb-0" />
        <div className="flex items-center gap-2 rounded-[10px] bg-[var(--ib-accbg)] px-3 py-2">
          <Sparkles className="h-4 w-4 text-[var(--ib-acc)]" aria-hidden />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ib-acc)]">
              Total XP
            </p>
            <p
              className="text-[18px] font-bold leading-none text-[var(--ib-ink)]"
              aria-label={`Total experience points ${xpTotal}`}
            >
              {xpTotal}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[13px] font-semibold text-[var(--ib-ink)]">
          Recently earned
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-[var(--ib-mute)]">
            No XP yet. Complete onboarding, courses, exams, or qualifying AI
            work to earn points.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-3 rounded-[10px] bg-[var(--ib-bg)]/70 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--ib-ink)]">
                    {row.eventType.replace(/_/g, " ")}
                  </p>
                  <p className="text-[11px] text-[var(--ib-mute)]">
                    {formatDate(row.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-bold text-[var(--ib-acc)]">
                  +{row.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--ib-ink)]">
          <Target className="h-4 w-4 text-[var(--ib-acc)]" aria-hidden />
          Milestones
        </h3>
        {milestones.length === 0 ? (
          <p className="text-sm text-[var(--ib-mute)]">No milestones configured.</p>
        ) : (
          <ul className="space-y-3">
            {milestones.map((m) => {
              const pct = Math.min(
                100,
                Math.round((m.progress / Math.max(m.target, 1)) * 100),
              );
              return (
                <li key={m.key} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ib-ink)]">
                        {m.completed ? (
                          <Award
                            className="h-3.5 w-3.5 text-[var(--ib-ok)]"
                            aria-label="Completed"
                          />
                        ) : null}
                        {m.name}
                      </p>
                      <p className="text-[11px] text-[var(--ib-mute)]">
                        {m.description}
                        {m.completed && m.completedAt
                          ? ` · ${formatDate(m.completedAt)}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12px] font-semibold text-[var(--ib-mute)]">
                      {m.progress}/{m.target}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-[var(--ib-line)]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${m.name} progress`}
                  >
                    <div
                      className="h-full rounded-full bg-[var(--ib-acc)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
