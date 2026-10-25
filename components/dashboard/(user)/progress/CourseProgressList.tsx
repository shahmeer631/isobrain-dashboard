"use client";

import React from "react";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ICourseProgress } from "@/types/userDashboardTypes";
import { CourseProgressSkeleton } from "./ProgressSkeleton";

interface CourseProgressListProps {
  courseProgress?: ICourseProgress[];
  isLoading?: boolean;
}

export function CourseProgressList({
  courseProgress,
  isLoading,
}: CourseProgressListProps) {
  if (isLoading) {
    return <CourseProgressSkeleton />;
  }

  return (
    <div className="ib-card space-y-5 p-5 sm:p-6">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
        Course Progress
      </h2>

      <div className="space-y-4">
        {courseProgress?.map((course) => (
          <div
            key={course.courseId}
            className="group relative rounded-[12px] border border-[var(--ib-line)] bg-[var(--ib-bg)]/60 p-5 transition-[border-color,box-shadow] duration-200 hover:border-[color-mix(in_srgb,var(--ib-acc)_28%,var(--ib-line))] hover:shadow-[0_8px_20px_-16px_rgba(14,20,36,0.2)] sm:p-6"
          >
            {/* Grade Badge */}
            <div
              className={cn(
                "absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-[12px] font-black shadow-sm border-2 transition-transform group-hover:scale-110 duration-300",
                course.grade === "A+"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : course.grade === "A"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-[var(--ib-accbg)] text-[var(--ib-acc)] border-[var(--ib-line)]",
              )}
            >
              {course.grade}
            </div>

            <div className="space-y-4">
              <div className="space-y-1 pr-12">
                <h4 className="text-[16px] font-black text-[var(--ib-ink)] dark:text-white group-hover:text-[var(--ib-acc)] transition-colors">
                  {course.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-[var(--ib-mute)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.completedLessons}/{course.totalLessons} lessons
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {course.totalTime}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Last: {course.lastActivity}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                  <span
                    className={
                      course.progress === 100
                        ? "text-emerald-500"
                        : "text-[var(--ib-ink)] dark:text-white"
                    }
                  >
                    {course.progress}% Complete
                  </span>
                  <span className="text-[var(--ib-mute)] font-bold">
                    {course.progress === 100
                      ? "Completed"
                      : `Next deadline: ${course.deadline}`}
                  </span>
                </div>
                <Progress
                  value={course.progress}
                  indicatorClassName={cn(
                    "bg-linear-to-r transition-all duration-1000",
                    course.progress === 100
                      ? "from-emerald-400 via-emerald-500 to-green-600"
                      : "bg-[var(--ib-acc)]",
                  )}
                  className="h-2 rounded-full bg-[var(--ib-line)] dark:bg-[var(--ib-bg)]/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
