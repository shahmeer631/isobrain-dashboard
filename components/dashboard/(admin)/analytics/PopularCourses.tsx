"use client";

import React from "react";
import { Star, Users } from "lucide-react";

interface PopularCoursesProps {
  courses?: Array<{
    name: string;
    students: number;
    rating: number;
  }>;
}

export function PopularCourses({ courses }: PopularCoursesProps) {
  return (
    <div className="bg-white dark:bg-[var(--ib-dk)] rounded-3xl p-8 shadow-sm h-full">
      <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-8">
        Popular Courses
      </h3>
      <div className="space-y-4">
        {(courses || []).length > 0 ? (
          (courses || []).map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-2xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-white group-hover:text-[var(--ib-acc)] transition-colors">
                  {course.name}
                </h4>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--ib-mute)]">
                  <Users className="w-3.5 h-3.5" />
                  {course.students.toLocaleString()} students
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[var(--ib-dk)] px-3 py-1.5 rounded-xl shadow-sm border border-[var(--ib-line)] dark:border-[var(--ib-line)]">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-black text-[var(--ib-ink)] dark:text-white">
                  {course.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-[var(--ib-mute)] italic">
            No course data available.
          </div>
        )}
      </div>
    </div>
  );
}
