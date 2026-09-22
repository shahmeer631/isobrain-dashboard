"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Edit,
  Archive,
  Trash2,
  ArchiveRestore,
  LucideIcon,
} from "lucide-react";

export interface ManagementCardStats {
  label: string;
  value: string | number;
  isHighlight?: boolean;
}

interface ManagementCardProps {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  status: string;
  stats: ManagementCardStats[];
  onEdit: () => void;
  onPrimaryAction?: () => void;
  primaryActionIcon: LucideIcon;
  primaryActionLabel: string;
  onArchive: () => void;
  onDelete: () => void;
  footerExtra?: React.ReactNode;
  statusConfig?: Record<string, string>; // Maps status to tailwind classes
}

export function ManagementCard({
  icon,
  tag,
  title,
  subtitle,
  status,
  stats,
  onEdit,
  onPrimaryAction,
  primaryActionIcon: PrimaryIcon,
  primaryActionLabel,
  onArchive,
  onDelete,
  footerExtra,
  statusConfig,
}: ManagementCardProps) {
  const getStatusClasses = (status: string) => {
    if (statusConfig && statusConfig[status]) {
      return statusConfig[status];
    }

    // Default fallback styles
    switch (status) {
      case "Active":
      case "Published":
        return "bg-indigo-600 text-white";
      case "Draft":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
      case "Archived":
        return "bg-red-50 dark:bg-red-900/20 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      {/* Card Header: Icon & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 text-xl">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {tag}
          </h3>
        </div>
        <Badge
          className={cn(
            "rounded-md px-2.5 py-0.5 font-bold text-[12px] border-none shadow-sm",
            getStatusClasses(status),
          )}
        >
          {status}
        </Badge>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-6">
        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
          {title}
        </h4>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-y-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-[13px] text-slate-500 font-semibold mb-0.5">
              {stat.label}
            </p>
            <p
              className={cn(
                "font-bold text-[15px]",
                stat.isHighlight
                  ? "text-emerald-600"
                  : "text-slate-900 dark:text-white",
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* rating/edited info */}
      {footerExtra}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 group/btn"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-indigo-600 transition-colors" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 group/btn"
          onClick={onPrimaryAction}
        >
          <PrimaryIcon className="w-4 h-4 mr-2 group-hover/btn:text-indigo-600 transition-colors" />
          {primaryActionLabel}
        </Button>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onArchive}
          className="flex items-center text-[13px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          {status === "Archived" ? (
            <>
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Restore
            </>
          ) : (
            <>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </>
          )}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center text-[13px] font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
}
