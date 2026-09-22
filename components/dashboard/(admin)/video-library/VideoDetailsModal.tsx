"use client";

import React from "react";
import {
  MdOutlinePlayArrow,
  MdOutlineVisibility,
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSchool,
  MdOutlineLibraryBooks,
  MdOutlineQuiz,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { IVideo } from "@/types/videoTypes";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface VideoDetailsModalProps {
  video: IVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoDetailsModal({
  video,
  open,
  onOpenChange,
}: VideoDetailsModalProps) {
  if (!video) return null;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Video Details"
      maxWidth="sm:max-w-[850px]"
    >
      <ScrollArea className="max-h-[85vh] pr-4">
        <div className="space-y-8 pb-8">
          {/* Video Player Section */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200 dark:border-slate-800">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                className="w-full h-full object-contain"
                controls
                poster={video.thumbnail || ""}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <MdOutlinePlayArrow className="w-16 h-16 opacity-20 mb-2" />
                <p className="font-bold">No video URL available</p>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {video.title}
                </h2>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                    video.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}
                >
                  {video.status}
                </Badge>
              </div>
              <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                {video.description || "No description provided for this video."}
              </p>
            </div>

            <div className="space-y-3">
              <InfoCard
                icon={<MdOutlineAccessTime />}
                label="Duration"
                value={video.duration || "N/A"}
              />
              <InfoCard
                icon={<MdOutlineVisibility />}
                label="Total Views"
                value={video.views?.toString() || "0"}
              />
              <InfoCard
                icon={<MdOutlineCalendarToday />}
                label="Uploaded"
                value={new Date(video.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          </div>

          <Separator className="bg-slate-100 dark:bg-slate-800" />

          {/* Lessons & Quizzes Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <MdOutlineSchool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Linked Lessons ({video.lessons?.length || 0})
              </h3>
            </div>

            {video.lessons && video.lessons.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {video.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="group bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-lg border border-slate-100 dark:border-slate-700">
                          {lesson.order || idx + 1}
                        </div>
                        <div>
                          <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-1">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                              <MdOutlineLibraryBooks className="w-4 h-4" />
                              CourseID: {lesson.courseId.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quizzes in Lesson */}
                    {lesson.quizzes && lesson.quizzes.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 mb-4">
                          <MdOutlineQuiz className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">
                            Quiz Section
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {lesson.quizzes.map((quiz) =>
                            quiz.questions?.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-5"
                              >
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[11px] font-black text-slate-500 shrink-0">
                                    {qIdx + 1}
                                  </div>
                                  <p className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
                                    {q.question}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                                  {q.options.map((option, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={cn(
                                        "px-3 py-2 rounded-xl text-[13px] font-medium border transition-colors",
                                        String.fromCharCode(65 + oIdx) === q.answer
                                          ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                          : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-slate-400"
                                      )}
                                    >
                                      <span className="font-black mr-2">
                                        {String.fromCharCode(65 + oIdx)}.
                                      </span>
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 font-bold">
                  No linked lessons found for this video.
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </DashboardModal>
  );
}

function InfoCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
        {React.isValidElement(icon) ? (
          React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
            className: "w-5 h-5" 
          })
        ) : (
          icon
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-[14px] font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
