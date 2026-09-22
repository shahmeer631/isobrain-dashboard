"use client";

import React from "react";
import Image from "next/image";
import { Play, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { IMyCourse } from "@/types/userDashboardTypes";

interface CourseCardProps {
  course: IMyCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  const isCompleted = (course.progress || 0) === 100;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 flex flex-col">
      {/* Thumbnail Container */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Progress Badge on Image */}
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              "text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md whitespace-nowrap",
              isCompleted
                ? "bg-emerald-500 text-white"
                : "bg-white/90 text-slate-900",
            )}
          >
            {course.progress || 0}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col space-y-5">
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md">
            {course.category || "General"}
          </span>
          <h4 className="text-[17px] font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug min-h-[48px]">
            {course.title}
          </h4>
          <p className="text-[13px] font-medium text-slate-400">
            by {course.instructor || "Expert Instructor"}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <Progress
            value={course.progress || 0}
            indicatorClassName={cn(
              "bg-linear-to-r",
              isCompleted
                ? "from-emerald-500 to-green-600"
                : "from-indigo-500 to-purple-600",
            )}
            className="h-2.5 bg-slate-100 dark:bg-slate-800/50"
          />
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
            <span>
              {course.lessonsDone || 0} / {course.totalLessons || 0} lessons
            </span>
            <span>{course.totalTime || "0h"}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            className={cn(
              "w-full h-12 rounded-xl font-bold text-[13px] gap-2 transition-all active:scale-95 shadow-lg",
              isCompleted
                ? "bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-none"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-600/20",
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Review Course
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Continue Learning
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
