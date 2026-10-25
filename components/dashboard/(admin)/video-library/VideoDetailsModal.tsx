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
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-[var(--ib-line)] dark:border-[var(--ib-line)]">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                className="w-full h-full object-contain"
                controls
                poster={video.thumbnail || ""}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[var(--ib-mute)]">
                <MdOutlinePlayArrow className="w-16 h-16 opacity-20 mb-2" />
                <p className="font-bold">No video URL available</p>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-[var(--ib-ink)] dark:text-white leading-tight">
                  {video.title}
                </h2>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                    video.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-[var(--ib-bg)] text-[var(--ib-mute)] border-[var(--ib-line)]"
                  )}
                >
                  {video.status}
                </Badge>
              </div>
              <p className="text-[15px] text-[var(--ib-mute)] font-medium leading-relaxed">
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

          <Separator className="bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]" />

          {/* Lessons & Quizzes Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/30 flex items-center justify-center text-[var(--ib-acc)]">
                <MdOutlineSchool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[var(--ib-ink)] dark:text-white">
                Linked Lessons ({video.lessons?.length || 0})
              </h3>
            </div>

            {video.lessons && video.lessons.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {video.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="group bg-[var(--ib-bg)]/50 dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-3xl p-6 transition-all hover:bg-white dark:hover:bg-[var(--ib-dk)] hover:shadow-xl hover:"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[var(--ib-dk)] flex items-center justify-center text-[var(--ib-mute)] font-black text-lg border border-[var(--ib-line)] dark:border-[var(--ib-line)]">
                          {lesson.order || idx + 1}
                        </div>
                        <div>
                          <h4 className="text-[17px] font-bold text-[var(--ib-ink)] dark:text-white mb-1">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs font-bold text-[var(--ib-mute)]">
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
                        <div className="flex items-center gap-2 text-[var(--ib-acc)] mb-4">
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
                                className="bg-white dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-2xl p-5"
                              >
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="w-6 h-6 rounded-lg bg-[var(--ib-bg)] dark:bg-[var(--ib-bg)] flex items-center justify-center text-[11px] font-black text-[var(--ib-mute)] shrink-0">
                                    {qIdx + 1}
                                  </div>
                                  <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
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
                                          : "bg-[var(--ib-bg)] border-[var(--ib-line)] text-[var(--ib-mute)] dark:bg-[var(--ib-bg)]/50 dark:border-[var(--ib-line)]/50 dark:text-[var(--ib-mute)]"
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
              <div className="py-12 text-center bg-[var(--ib-bg)]/50 dark:bg-[var(--ib-dk)]/50 border border-dashed border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-3xl">
                <p className="text-[var(--ib-mute)] font-bold">
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
    <div className="bg-[var(--ib-bg)]/50 dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[var(--ib-dk)] shadow-sm flex items-center justify-center text-[var(--ib-mute)]">
        {React.isValidElement(icon) ? (
          React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
            className: "w-5 h-5" 
          })
        ) : (
          icon
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-[var(--ib-mute)] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
