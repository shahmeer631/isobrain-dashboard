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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm h-full">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-8">
        Popular Courses
      </h3>
      <div className="space-y-4">
        {(courses || []).length > 0 ? (
          (courses || []).map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h4>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {course.students.toLocaleString()} students
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-black text-slate-900 dark:text-white">
                  {course.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-slate-500 italic">
            No course data available.
          </div>
        )}
      </div>
    </div>
  );
}
