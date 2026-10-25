import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader — Reusable page-level heading with an optional subtitle and
 * right-aligned action slot (e.g. buttons).
 *
 * Usage:
 *   <PageHeader
 *     title="Dashboard Overview"
 *     subtitle="Monitor your platform performance and activity"
 *     actions={<Button>Create New Course</Button>}
 *   />
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 font-sans md:flex-row md:items-end",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[24px] font-bold leading-tight tracking-[-0.025em] text-[var(--ib-ink)] min-[981px]:text-[26px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[var(--ib-mute)]">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
