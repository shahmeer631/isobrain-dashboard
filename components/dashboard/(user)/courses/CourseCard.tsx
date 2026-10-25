"use client";

import React from "react";
import Image from "next/image";
import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IMyCourse } from "@/types/userDashboardTypes";

interface CourseCardProps {
  course: IMyCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  const progress = course.progress || 0;
  const isCompleted = progress === 100;

  return (
    <div className="ib-card ib-card-interactive group flex flex-col overflow-hidden">
      <div className="relative aspect-16/10 overflow-hidden bg-[var(--ib-bg)]">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1c2a5a] to-[#0f1936]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/35 to-transparent" />
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md",
              isCompleted
                ? "bg-[var(--ib-ok)] text-white"
                : "bg-[var(--ib-card)]/95 text-[var(--ib-ink)]"
            )}
          >
            {progress}%
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="space-y-2">
          <span className="ib-chip">{course.category || "General"}</span>
          <h4 className="min-h-[44px] text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[var(--ib-ink)] transition-colors group-hover:text-[var(--ib-acc)]">
            {course.title}
          </h4>
          <p className="text-[13px] text-[var(--ib-mute)]">
            by {course.instructor || "Expert Instructor"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="ib-progress">
            <span
              className="ib-progress-fill"
              style={{
                width: `${progress}%`,
                background: isCompleted ? "var(--ib-ok)" : "var(--ib-acc)",
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[12px] font-medium text-[var(--ib-mute)]">
            <span>
              {course.lessonsDone || 0} / {course.totalLessons || 0} lessons
            </span>
            <span>{course.totalTime || "0h"}</span>
          </div>
        </div>

        <div className="pt-1">
          <Button
            className={cn(
              "h-11 w-full gap-2 rounded-[9px] text-[13px] font-semibold transition-all active:scale-[0.98]",
              isCompleted
                ? "border border-[var(--ib-line)] bg-[var(--ib-bg)] text-[var(--ib-ink)] shadow-none hover:bg-[var(--ib-line)]"
                : "bg-[var(--ib-acc)] text-[var(--ib-on)] hover:opacity-92"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Review Course
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Continue Learning
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
