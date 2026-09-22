"use client";

import React from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { ProgressStats } from "@/components/dashboard/(user)/progress/ProgressStats";
import { WeeklyActivity } from "@/components/dashboard/(user)/progress/WeeklyActivity";
import { CourseProgressList } from "@/components/dashboard/(user)/progress/CourseProgressList";
import { AssignmentsList } from "@/components/dashboard/(user)/progress/AssignmentsList";
import { NextAchievement } from "@/components/dashboard/(user)/progress/NextAchievement";

import { useGetUserProgressQuery } from "@/lib/redux/features/user/userDashboardApi";

const ProgressPage = () => {
  const { data: progressData, isLoading } = useGetUserProgressQuery();

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <PageHeader
          title="My Progress"
          subtitle="Track your learning journey and achievements"
        />

        {/* Stats Grid */}
        <ProgressStats
          avgProgress={progressData?.data?.stats?.avgProgress || 0}
          activeCourses={progressData?.data?.stats?.activeCourses || 0}
          completedCourses={progressData?.data?.stats?.completedCourses || 0}
          totalTime={progressData?.data?.stats?.totalTime || "0h"}
          isLoading={isLoading}
        />

        {/* Dynamic Layout Bottom */}
        <div className="w-full flex flex-col gap-8">
          <WeeklyActivity
            weeklyActivity={progressData?.data?.weeklyActivity}
            isLoading={isLoading}
          />
          <CourseProgressList 
            courseProgress={progressData?.data?.courseProgress}
            isLoading={isLoading}
          />
          <div className="hidden">
            <AssignmentsList />
          </div>
          <div className="hidden">
            <NextAchievement />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProgressPage;
