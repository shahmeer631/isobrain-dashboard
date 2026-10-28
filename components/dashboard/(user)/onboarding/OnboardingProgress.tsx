"use client";

import { cn } from "@/lib/utils";

const STEP_LABELS = ["Welcome", "Industry", "Role", "Standards"];

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const active = step === currentStep;
          const done = step < currentStep;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      done || active
                        ? "bg-[var(--ib-acc)]"
                        : "bg-[var(--ib-line)]",
                    )}
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    done || active
                      ? "bg-[var(--ib-acc)] text-white"
                      : "bg-[var(--ib-bg)] text-[var(--ib-mute)] ring-1 ring-[var(--ib-line)]",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {step}
                </span>
                {index < STEP_LABELS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      done ? "bg-[var(--ib-acc)]" : "bg-[var(--ib-line)]",
                    )}
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-wide sm:text-xs",
                  active
                    ? "text-[var(--ib-ink)]"
                    : "text-[var(--ib-mute)]",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
