"use client";

import React from "react";
import { CourseCard } from "./CourseCard";
import { BookOpen } from "lucide-react";
import { IMyCourse } from "@/types/userDashboardTypes";
import { CourseGridSkeleton } from "./CourseDashboardSkeleton";

interface CourseGridProps {
  courses: IMyCourse[];
  isLoading?: boolean;
}

export function CourseGrid({ courses, isLoading }: CourseGridProps) {
  if (isLoading) {
    return <CourseGridSkeleton />;
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 rounded-3xl border border-dashed border-[var(--ib-line)] dark:border-[var(--ib-line)]">
        <div className="h-20 w-20 rounded-full bg-white dark:bg-[var(--ib-dk)] flex items-center justify-center shadow-sm mb-6">
          <BookOpen className="w-10 h-10 text-[var(--ib-mute)]" />
        </div>
        <h3 className="text-[18px] font-black text-[var(--ib-ink)] dark:text-white mb-2">
          No courses found
        </h3>
        <p className="text-[var(--ib-mute)] max-w-xs mx-auto text-sm font-medium">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}
