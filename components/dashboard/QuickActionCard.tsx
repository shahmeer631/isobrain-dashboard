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
        "flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-6 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer w-full group",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
        {label}
      </span>
    </Link>
  );
}
