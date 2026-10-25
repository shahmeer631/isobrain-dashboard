import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/** Section title row — matches HTML `.sec` */
export function SectionHeader({
  title,
  href,
  linkLabel,
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-3.5 flex items-center justify-between gap-3", className)}>
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
        {title}
      </h2>
      {href && linkLabel ? (
        <Link href={href} className="ib-sec-link shrink-0">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** Compact glance stat — matches HTML `.s` */
export function GlanceStat({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ib-card group relative overflow-hidden p-[18px] transition-colors",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-4 size-16 rounded-full bg-[var(--ib-accbg)] opacity-60 transition-opacity group-hover:opacity-90"
      />
      <div className="relative flex size-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--ib-acc)_14%,var(--ib-line))] bg-[var(--ib-accbg)] text-[var(--ib-acc)]">
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
      </div>
      <b className="relative mt-3.5 block text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ib-ink)]">
        {value}
      </b>
      <span className="relative text-[13px] text-[var(--ib-mute)]">{label}</span>
    </div>
  );
}

/** Progress bar — matches HTML `.bar` */
export function ProgressBar({
  value,
  className,
  minVisible,
}: {
  value: number;
  className?: string;
  /** Show a tiny fill when progress is 0 (HTML used 2%) */
  minVisible?: number;
}) {
  const width = Math.min(
    100,
    Math.max(value, value > 0 ? value : minVisible ?? 0)
  );
  return (
    <div
      className={cn("ib-progress", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="ib-progress-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

export function StatusBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("ib-status", className)}>{children}</span>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ib-card space-y-3 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--ib-acc)_16%,var(--ib-line))] bg-[var(--ib-accbg)] text-[var(--ib-acc)]">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
        {title}
      </h4>
      {description ? (
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--ib-mute)]">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}) {
  return (
    <button type="button" className={cn("ib-btn", className)} {...props}>
      {children}
    </button>
  );
}
