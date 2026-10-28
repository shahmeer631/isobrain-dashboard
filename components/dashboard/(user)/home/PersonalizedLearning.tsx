"use client";

import Link from "next/link";
import { BookOpen, Compass, RefreshCw, Sparkles, Target } from "lucide-react";
import {
  useGetPersonalizationOverviewQuery,
  type PersonalizedCourse,
} from "@/lib/redux/api/personalizationApi";
import {
  EmptyState,
  SectionHeader,
} from "@/components/dashboard/design-system";
import { Skeleton } from "@/components/ui/skeleton";

function courseHref(course: PersonalizedCourse) {
  // My Courses only lists enrollments — deep-filter only when already enrolled.
  if (course.enrolled && course.courseId) {
    return `/user/courses?courseId=${encodeURIComponent(course.courseId)}`;
  }
  return "/user/courses";
}

function CourseRecCard({
  course,
  href,
}: {
  course: PersonalizedCourse;
  href?: string;
}) {
  const destination = href || courseHref(course);
  return (
    <Link
      href={destination}
      className="ib-card block p-4 transition hover:border-[var(--ib-acc)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)]"
    >
      <p className="line-clamp-2 text-[14px] font-semibold text-[var(--ib-ink)]">
        {course.title}
      </p>
      {course.categoryName ? (
        <p className="mt-1 text-[12px] text-[var(--ib-mute)]">
          {course.categoryName}
        </p>
      ) : null}
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--ib-mute)]">
        {course.explanation}
      </p>
      {typeof course.progress === "number" && course.enrolled ? (
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[var(--ib-acc)]">
          {course.progress}% complete
        </p>
      ) : null}
    </Link>
  );
}

function SectionBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Sparkles;
  items: PersonalizedCourse[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--ib-acc)]" aria-hidden />
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--ib-mute)]">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[700px]:grid-cols-2">
        {items.map((course) => (
          <CourseRecCard key={`${title}-${course.courseId}`} course={course} />
        ))}
      </div>
    </div>
  );
}

export function PersonalizedLearning() {
  const { data, isLoading, isError, isFetching, refetch } =
    useGetPersonalizationOverviewQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-56 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded-lg" />
        <div className="grid grid-cols-1 gap-3 min-[700px]:grid-cols-2">
          <Skeleton className="h-28 rounded-[12px]" />
          <Skeleton className="h-28 rounded-[12px]" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div>
        <SectionHeader title="Personalized for you" />
        <EmptyState
          icon={Sparkles}
          title="Couldn’t load recommendations"
          description="Check your connection and try again. Your other dashboard data is unaffected."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="ib-btn mx-auto mt-2 inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Retry
            </button>
          }
        />
      </div>
    );
  }

  const overview = data.data;
  const { recommendations, learningPath, profile, focusSummary } = overview;
  const hasAny =
    recommendations.forYou.length > 0 ||
    recommendations.explore.length > 0 ||
    recommendations.nextStep != null ||
    (learningPath.current != null);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionHeader title="Personalized for you" />
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[var(--ib-mute)]">
            {focusSummary}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ib-line)] px-3 py-1.5 text-[12px] font-medium text-[var(--ib-ink)] hover:bg-[var(--ib-soft)] disabled:opacity-60"
          aria-label="Refresh recommendations"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      {!profile.onboardingCompleted ? (
        <div className="ib-card mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[13px] text-[var(--ib-mute)]">
            Finish onboarding to improve role and ISO-standard matches.
          </p>
          <Link href="/user/onboarding" className="ib-btn w-fit text-[12px]">
            Update profile →
          </Link>
        </div>
      ) : null}

      {!hasAny ? (
        <EmptyState
          icon={BookOpen}
          title="No matching resources yet"
          description="There are currently no published courses that match your selected standards. Browse the catalogue or update your learning targets."
          action={
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/user/courses" className="ib-btn w-fit">
                Browse courses →
              </Link>
              <Link
                href="/user/settings"
                className="inline-flex items-center rounded-lg border border-[var(--ib-line)] px-3 py-2 text-[12px] font-medium"
              >
                Review preferences
              </Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-6">
          {learningPath.nextRecommended ? (
            <div className="ib-card border-[var(--ib-acc)]/25 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ib-acc)]">
                Next recommended step
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[var(--ib-ink)]">
                {learningPath.nextRecommended.title}
              </p>
              <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
                {learningPath.nextRecommended.explanation}
              </p>
              <p className="mt-2 text-[12px] text-[var(--ib-mute)]">
                Suggested — not automatically enrolled.
              </p>
              <Link
                href={courseHref(learningPath.nextRecommended)}
                className="ib-btn mt-3 w-fit text-[12px]"
              >
                View in my courses →
              </Link>
            </div>
          ) : null}

          <SectionBlock
            title="Recommended for you"
            icon={Sparkles}
            items={recommendations.forYou.slice(0, 4)}
          />
          <SectionBlock
            title="Your target ISO standards"
            icon={Target}
            items={recommendations.targetStandards.slice(0, 4)}
          />
          <SectionBlock
            title="Explore something new"
            icon={Compass}
            items={recommendations.explore.slice(0, 3)}
          />
        </div>
      )}
    </div>
  );
}
