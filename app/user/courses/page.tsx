"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { CourseStats } from "@/components/dashboard/(user)/courses/CourseStats";
import { CourseFilter } from "@/components/dashboard/(user)/courses/CourseFilter";
import { CourseGrid } from "@/components/dashboard/(user)/courses/CourseGrid";
import { useGetMyCoursesQuery } from "@/lib/redux/features/user/userDashboardApi";

const MyCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All Courses");

  const { data: myCoursesData, isLoading } = useGetMyCoursesQuery();

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
      <div className="space-y-10 pb-10">
        <PageHeader
          title="My Courses"
          subtitle="Access all your enrolled courses and continue learning"
        />

        {/* Stats Grid */}
        <CourseStats stats={myCoursesData?.data?.stats} isLoading={isLoading} />

        {/* Filters */}
        <CourseFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Course Grid */}
        <CourseGrid courses={filteredCourses} isLoading={isLoading} />
      </div>
    </Container>
  );
};

export default MyCoursesPage;
