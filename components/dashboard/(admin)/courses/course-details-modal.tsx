"use client";

import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Badge } from "@/components/ui/badge";
import { useGetSingleCourseQuery } from "@/lib/redux/features/course/courseApi";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  FileText,
  Layout,
  Loader2,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";

interface CourseDetailsModalProps {
  courseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailsModal({
  courseId,
  open,
  onOpenChange,
}: CourseDetailsModalProps) {
  const { data: courseData, isLoading } = useGetSingleCourseQuery(
    courseId as string,
    { skip: !courseId || !open }
  );

  const course = courseData?.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "DRAFT":
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)] dark:bg-[var(--ib-dk)] dark:text-[var(--ib-mute)]";
      case "ARCHIVED":
        return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)]";
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Course Details"
      maxWidth="sm:max-w-[700px]"
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--ib-acc)]" />
        </div>
      ) : course ? (
        <div className="space-y-6">
          {/* Header Section with Thumbnail & Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative aspect-video w-full md:w-64 overflow-hidden rounded-xl border border-[var(--ib-line)] dark:border-[var(--ib-line)] shadow-sm">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] flex items-center justify-center">
                  <Layout className="w-8 h-8 text-[var(--ib-mute)]" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={cn("px-2.5 py-0.5 font-bold", getStatusBadge(course.status))}>
                  {course.status}
                </Badge>
                <span className="text-xs text-[var(--ib-mute)] font-medium">
                  ID: {course.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--ib-ink)] dark:text-white leading-tight">
                {course.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--ib-mute)]">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>{course.category?.name || "Uncategorized"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--ib-line)] dark:border-[var(--ib-line)]">
            {/* Essential Stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ib-ink)] dark:text-white uppercase tracking-wider">
                Essential Information
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50">
                  <div className="flex items-center gap-2 text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">CPD Hours</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-white">
                    {course.cpdHours} Hours
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50">
                  <div className="flex items-center gap-2 text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Created On</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-white">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50">
                  <div className="flex items-center gap-2 text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-white">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--ib-ink)] dark:text-white uppercase tracking-wider">
                Course Description
              </h3>
              <div className="relative group">
                <div className="p-4 rounded-xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 min-h-[140px]">
                  <p className="text-sm text-[var(--ib-mute)] dark:text-[var(--ib-mute)] leading-relaxed">
                    {course.description || "No description provided for this course."}
                  </p>
                </div>
                <FileText className="absolute bottom-3 right-3 w-4 h-4 text-[var(--ib-mute)] dark:text-[var(--ib-ink)] group-hover:text-[var(--ib-acc)] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[var(--ib-mute)]">
          Course not found or an error occurred.
        </div>
      )}
    </DashboardModal>
  );
}
