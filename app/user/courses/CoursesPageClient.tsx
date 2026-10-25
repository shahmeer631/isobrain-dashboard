"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { CourseStats } from "@/components/dashboard/(user)/courses/CourseStats";
import { CourseFilter } from "@/components/dashboard/(user)/courses/CourseFilter";
import { CourseGrid } from "@/components/dashboard/(user)/courses/CourseGrid";
import { useGetMyCoursesQuery } from "@/lib/redux/features/user/userDashboardApi";
import { useSearchParams } from "next/navigation";

export default function CoursesPageClient() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All Courses");

  const { data: myCoursesData, isLoading } = useGetMyCoursesQuery();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    if (!myCoursesData?.data?.courses) return [];

    return myCoursesData.data.courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        activeStatus === "All" || course.status === activeStatus;
      const matchesCategory =
        activeCategory === "All Courses" || course.category === activeCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [myCoursesData, searchQuery, activeStatus, activeCategory]);

  return (
    <Container>
      <div className="space-y-6 pb-8">
        <PageHeader
          title="My Courses"
          subtitle="Access all your enrolled courses and continue learning"
        />

        <CourseStats stats={myCoursesData?.data?.stats} isLoading={isLoading} />

        <CourseFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <CourseGrid courses={filteredCourses} isLoading={isLoading} />
      </div>
    </Container>
  );
}
