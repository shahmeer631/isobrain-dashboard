"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ContentStatus = "Published" | "Draft" | "Archived" | "Pending";

interface RecentlyEditedCardProps {
  /** URL or path to the thumbnail image */
  imageSrc: string;
  imageAlt?: string;
  /** e.g. "Course", "Bundle", "Standard" */
  contentType: string;
  title: string;
  /** e.g. "John Doe" */
  editedBy: string;
  /** e.g. "2 hours ago" */
  editedAt: string;
  status: ContentStatus;
  /** Optional extra menu actions */
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const statusStyles: Record<ContentStatus, string> = {
  Published:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Archived:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

/**
 * RecentlyEditedCard — A course/content thumbnail card used in the "Recently
 * Edited" grid section of the dashboard.
 *
 * Usage:
 *   <RecentlyEditedCard
 *     imageSrc="/thumbnails/iso-14001.jpg"
 *     contentType="Course"
 *     title="Environmental Management Basics"
 *     editedBy="John Doe"
 *     editedAt="2 hours ago"
 *     status="Published"
 *   />
 */
export function RecentlyEditedCard({
  imageSrc,
  imageAlt,
  contentType,
  title,
  editedBy,
  editedAt,
  status,
  onEdit,
  onDelete,
  className,
}: RecentlyEditedCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 p-6">
        {/* Content type */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          {contentType}
        </p>

        {/* Title */}
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {title}
        </p>

        {/* Editor info */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Edited by{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {editedBy}
          </span>{" "}
          · {editedAt}
        </p>

        {/* Footer: status badge + menu */}
        <div className="flex items-center justify-between pt-1">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              statusStyles[status],
            )}
          >
            {status}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-rose-500 focus:text-rose-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
              {!onEdit && !onDelete && (
                <>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem className="text-rose-500 focus:text-rose-600">
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
