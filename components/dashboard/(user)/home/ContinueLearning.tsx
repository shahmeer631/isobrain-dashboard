import React from "react";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { IContinueLearningCourse } from "@/types/userDashboardTypes";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ContinueLearningSkeleton } from "./UserDashboardSkeleton";

interface ContinueLearningProps {
  courses?: IContinueLearningCourse[];
  isLoading?: boolean;
}

export function ContinueLearning({ courses = [], isLoading }: ContinueLearningProps) {
  if (isLoading) {
    return <ContinueLearningSkeleton />;
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <Play className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">No courses in progress</h4>
          <p className="text-slate-500 text-sm">Start your learning journey by exploring our available courses.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-slate-200">
          <Link href="#">Explore Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">
          Continue Learning
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 group transition-all"
        >
          View All{" "}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="relative w-full md:w-56 h-36 shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src={course.thumbnail || "/placeholder-course.png"}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[16px] font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                      {course.title}
                    </h4>
                    <span className="text-[11px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full whitespace-nowrap">
                      {course.progress || 0}% Complete
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">
                    ISO Certification Course
                  </p>
                </div>

                <div className="space-y-3">
                  <Progress
                    value={course.progress || 0}
                    indicatorClassName="bg-linear-to-r from-indigo-500 to-purple-600"
                    className="h-2 bg-slate-100 dark:bg-slate-800/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Course Status
                    </p>
                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate">
                      In Progress
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end md:justify-center md:pl-4">
                <Button asChild className="h-12 px-8 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[14px] shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                  <Link href={`/courses/${course.courseId}`}>Resume Lesson</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
