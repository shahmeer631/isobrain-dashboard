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
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-8 shadow-sm">
      <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
        Course Progress
      </h3>

      <div className="space-y-6">
        {courseProgress?.map((course) => (
          <div
            key={course.courseId}
            className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300 relative"
          >
            {/* Grade Badge */}
            <div
              className={cn(
                "absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-[12px] font-black shadow-sm border-2 transition-transform group-hover:scale-110 duration-300",
                course.grade === "A+"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : course.grade === "A"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-indigo-50 text-indigo-600 border-indigo-100",
              )}
            >
              {course.grade}
            </div>

            <div className="space-y-4">
              <div className="space-y-1 pr-12">
                <h4 className="text-[16px] font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                        : "text-slate-900 dark:text-white"
                    }
                  >
                    {course.progress}% Complete
                  </span>
                  <span className="text-slate-400 font-bold">
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
                      : "from-indigo-600 via-indigo-500 to-purple-500",
                  )}
                  className="h-2 rounded-full bg-slate-200 dark:bg-slate-700/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
