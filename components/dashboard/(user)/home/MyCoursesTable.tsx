"use client";

import React from "react";
import Link from "next/link";
import { IMyCourse } from "@/types/userDashboardTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ProgressBar,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/design-system";

interface MyCoursesTableProps {
  courses?: IMyCourse[];
  isLoading?: boolean;
}

function statusLabel(course: IMyCourse) {
  const progress = course.progress || 0;
  if (course.status) return course.status;
  if (progress >= 100) return "Completed";
  if (progress > 0) return "In progress";
  return "Not started";
}

export function MyCoursesTable({
  courses = [],
  isLoading,
}: MyCoursesTableProps) {
  if (isLoading) {
    return (
      <div>
        <SectionHeader
          title="My courses"
          href="/user/courses"
          linkLabel="Browse catalog →"
        />
        <div className="ib-card divide-y divide-[var(--ib-line)]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 p-4 min-[981px]:grid-cols-[2.4fr_1fr_1.2fr_1fr]"
            >
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="My courses"
        href="/user/courses"
        linkLabel="Browse catalog →"
      />

      <div className="ib-card overflow-hidden">
        {/* Header — hidden ≤980px per HTML */}
        <div className="hidden grid-cols-[2.4fr_1fr_1.2fr_1fr] gap-4 px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--ib-mute)] min-[981px]:grid">
          <span>Course</span>
          <span>Category</span>
          <span>Progress</span>
          <span>Status</span>
        </div>

        {courses.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-[var(--ib-mute)]">
            No enrolled courses yet.
          </div>
        ) : (
          courses.map((course, index) => {
            const progress = course.progress || 0;
            return (
              <Link
                key={course.courseId}
                href="/user/courses"
                className={cn(
                  "grid grid-cols-1 items-center gap-3 border-t border-[var(--ib-line)] px-5 py-3.5 transition-colors hover:bg-[var(--ib-accbg)]/30 min-[981px]:grid-cols-[2.4fr_1fr_1.2fr_1fr] min-[981px]:gap-4",
                  index === 0 && "min-[981px]:border-t"
                )}
              >
                <div className="min-w-0">
                  <b className="block truncate text-[14px] font-semibold text-[var(--ib-ink)]">
                    {course.title}
                  </b>
                  <small className="block text-[13px] text-[var(--ib-mute)]">
                    {course.instructor || course.category || "ISO Course"}
                  </small>
                </div>
                <span className="text-[14px] text-[var(--ib-ink)]">
                  {course.category || "Certification"}
                </span>
                <ProgressBar value={progress} className="max-w-[180px]" />
                <StatusBadge>{statusLabel(course)}</StatusBadge>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
