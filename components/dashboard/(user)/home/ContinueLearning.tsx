import React from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { IContinueLearningCourse } from "@/types/userDashboardTypes";
import Link from "next/link";
import { ContinueLearningSkeleton } from "./UserDashboardSkeleton";
import {
  EmptyState,
  ProgressBar,
  SectionHeader,
} from "@/components/dashboard/design-system";

interface ContinueLearningProps {
  courses?: IContinueLearningCourse[];
  isLoading?: boolean;
}

function thumbLabel(title: string) {
  const iso = title.match(/ISO(?:\/IEC)?\s*[\d:.-]+/i);
  if (iso) return iso[0];
  return title.length > 28 ? `${title.slice(0, 28)}…` : title;
}

export function ContinueLearning({
  courses = [],
  isLoading,
}: ContinueLearningProps) {
  if (isLoading) {
    return <ContinueLearningSkeleton />;
  }

  if (courses.length === 0) {
    return (
      <div>
        <SectionHeader
          title="Continue learning"
          href="/user/courses"
          linkLabel="View all →"
        />
        <EmptyState
          icon={Play}
          title="No courses in progress"
          description="Start your learning journey by exploring available courses."
          action={
            <Link href="/user/courses" className="ib-btn mx-auto mt-2 w-fit">
              View my courses →
            </Link>
          }
        />
      </div>
    );
  }

  const course = courses[0];
  const progress = course.progress || 0;
  const resumeHref =
    course.href ||
    `/user/courses?courseId=${encodeURIComponent(course.courseId)}`;

  return (
    <div>
      <SectionHeader
        title="Continue learning"
        href="/user/courses"
        linkLabel="View all →"
      />

      <div className="ib-card grid grid-cols-1 gap-[22px] p-5 min-[981px]:grid-cols-[230px_1fr]">
        <div className="relative flex min-h-[170px] items-end overflow-hidden rounded-[12px] bg-linear-to-br from-[#1c2a5a] to-[#0f1936] p-3.5">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(90deg,transparent 0 22px,rgba(255,255,255,.05) 22px 23px),repeating-linear-gradient(0deg,transparent 0 22px,rgba(255,255,255,.05) 22px 23px)",
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <span className="relative z-[1] text-[12px] font-semibold tracking-[0.06em] text-[#cfd8ff]">
            {thumbLabel(course.title)}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <span className="ib-chip">ISO Certification Course</span>
            <h3 className="mt-3 mb-1 text-[18px] font-semibold leading-[1.35] tracking-[-0.015em] text-[var(--ib-ink)] min-[981px]:text-[19px]">
              {course.title}
            </h3>
            {course.nextLesson ? (
              <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
                Next: {course.nextLesson}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-[13px] text-[var(--ib-mute)]">
              <span>Progress</span>
              <b className="font-semibold text-[var(--ib-ink)]">
                {progress}% complete
              </b>
            </div>
            <ProgressBar value={progress} minVisible={2} />
            <div className="mt-4 flex items-center gap-3.5">
              <Link href={resumeHref} className="ib-btn">
                Resume course →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {courses.length > 1 && (
        <div className="mt-3 space-y-2">
          {courses.slice(1).map((c) => (
            <Link
              key={c.courseId}
              href={
                c.href ||
                `/user/courses?courseId=${encodeURIComponent(c.courseId)}`
              }
              className="ib-card flex items-center gap-4 p-3.5 transition-colors hover:bg-[var(--ib-accbg)]/40"
            >
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--ib-bg)]">
                {c.thumbnail && (
                  <Image
                    src={c.thumbnail}
                    alt={c.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--ib-ink)]">
                  {c.title}
                </p>
                <p className="text-xs text-[var(--ib-mute)]">
                  {c.progress || 0}% complete
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
