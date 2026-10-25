"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  link?: string;
}

/**
 * QuickActionCard — A bordered card button with an icon and a label.
 * Used in the "Quick Actions" grid at the bottom of the dashboard.
 *
 * Usage:
 *   <QuickActionCard icon={PlusSquare} label="Create Course" onClick={...} />
 */
export function QuickActionCard({
  icon: Icon,
  label,
  onClick,
  className,
  link = "#",
}: QuickActionCardProps) {
  return (
    <Link
      href={link}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[var(--ib-line)] bg-[var(--ib-card)] px-6 py-6 transition-all duration-300 hover:shadow-md hover:border-[var(--ib-acc)]/30 hover:bg-[var(--ib-accbg)] cursor-pointer w-full group",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ib-bg)] text-[var(--ib-mute)] transition-colors duration-200 group-hover:bg-[var(--ib-acc)] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-semibold text-[var(--ib-ink)] tracking-tight">
        {label}
      </span>
    </Link>
  );
}
