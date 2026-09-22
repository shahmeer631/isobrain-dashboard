"use client";

import { FilterBar } from "@/components/dashboard/FilterBar";
import { ManagementCard } from "@/components/dashboard/ManagementCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Pagination } from "@/components/dashboard/Pagination";
import { CreateCourseModal } from "../../../components/dashboard/(admin)/courses/create-course-modal";
import { EditCourseModal } from "../../../components/dashboard/(admin)/courses/edit-course-modal";
import { CourseDetailsModal } from "../../../components/dashboard/(admin)/courses/course-details-modal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import {
  useGetCoursesQuery,
  useGetCourseswithoutPaginationQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation
} from "@/lib/redux/features/course/courseApi";
import { ICourse } from "@/types/courseTypes";
import { Eye, Plus, Star, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Courses");
  const itemsPerPage = 8;

  // 1. Paginated & Filtered Query for the main cards grid (Bottom section)
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  // 2. GET /courses/all Query for the Quick Titles list (Top section)
  const { data: allCoursesData, isLoading: allLoading } = useGetCourseswithoutPaginationQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      const response = await deleteCourse(courseToDelete.id).unwrap();
      if (response.success) {
        toast.success("Course deleted successfully");
        setIsDeleteOpen(false);
        setCourseToDelete(null);
      }
    } catch (err: unknown) {
      const error = err as Error & { data?: { message: string } };
      toast.error(error?.data?.message || "Failed to delete course");
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "ARCHIVED" ? "DRAFT" : "ARCHIVED";
      const response = await updateCourse({
        id,
        body: { status: newStatus as ICourse["status"] }
      }).unwrap();

      if (response.success) {
        toast.success(`Course ${newStatus === "ARCHIVED" ? "archived" : "restored"} successfully`);
      }
    } catch (err: unknown) {
      const error = err as Error & { data?: { message: string } };
      toast.error(error?.data?.message || error?.message || "Failed to update course status");
    }
  };

  const coursesList = useMemo(() => {
    return coursesData?.data || [];
  }, [coursesData]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-7 w-full mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-2 gap-y-4 mb-6">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-8" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="flex-1 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Courses</h3>
          <p className="text-slate-500 max-w-md">
            We couldn&apos;t fetch the courses at this time. Please check your connection or try again later.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* ── Header ── */}
      <PageHeader
        title="Course Management"
        subtitle="Create, edit, and manage all your courses"
        actions={
          <Button
            variant={"primary"}
            className="h-11"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-5 h-5 mr-1" />
            Create New Course
          </Button>
        }
      />

      {/* ── Quick Course Titles Section (GET /courses/all) ── */}
      <div className="mb-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">

          Active Course Titles
        </h3>

        {allLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
            {(allCoursesData?.data || []).map((course, idx) => (
              <div
                key={course.id}
                className="group flex items-start p-3 bg-slate-50/50 dark:bg-slate-800/30  border border-slate-100 dark:border-slate-850 rounded-xl transition-all duration-205"
              >
                <span className="text-[12px] font-mono text-indigo-500 dark:text-indigo-400 font-bold mr-2.5 mt-0.5 shrink-0 select-none">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span className="text-[16px] font-semibold text-slate-700 dark:text-slate-300 transition-colors leading-relaxed">
                  {course.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────────── */}
      <FilterBar
        activeFilter={statusFilter}
        filters={["All Courses", "Published", "Draft", "Archived"]}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          setCurrentPage(1); // Reset to first page on search
        }}
        setActiveFilter={(filter) => {
          setStatusFilter(filter);
          setCurrentPage(1); // Reset to first page on filter change
        }}
        placeholder="Search courses by title, instructor, or ID..."
      />

      {/* ── Cards Grid ──────────────────────────────────────────── */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesList.map((course) => (
            <ManagementCard
              key={course.id}
              id={course.id}
              icon={"📚"}
              tag={`ID: ${course.id.slice(-6).toUpperCase()}`}
              title={course.title}
              subtitle={`by ${course.instructor}`}
              status={(course.status.charAt(0) + course.status.slice(1).toLowerCase()) as "Published" | "Draft" | "Archived"}
              stats={[
                { label: "CPD Hours", value: `${course.cpdHours}h` },
                { label: "Category", value: course.category.name },
                { label: "Comments", value: "0" },
                { label: "Created", value: new Date(course.createdAt).toLocaleDateString() },
              ]}
              onEdit={() => {
                setEditingCourse(course);
                setIsEditOpen(true);
              }}
              onPrimaryAction={() => {
                setViewingCourseId(course.id);
                setIsViewOpen(true);
              }}
              primaryActionIcon={Eye}
              primaryActionLabel="View"
              onArchive={() => handleStatusUpdate(course.id, course.status)}
              onDelete={() => {
                setCourseToDelete(course);
                setIsDeleteOpen(true);
              }}
              statusConfig={{
                Published: "bg-blue-600 hover:bg-blue-600 text-white",
                Draft:
                  "bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300",
                Archived: "bg-red-50 dark:bg-red-900/20 text-red-600",
              }}
              footerExtra={
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-[15px]">
                      4.8
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {coursesData?.meta && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(coursesData.meta.total / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      <CreateCourseModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={() => {
          setIsCreateOpen(false);
          toast.success("Course created successfully");
        }}
      />

      <EditCourseModal
        courseId={editingCourse?.id || null}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEdit={() => {
          setIsEditOpen(false);
          toast.success("Course updated successfully");
        }}
      />

      <CourseDetailsModal
        courseId={viewingCourseId}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Container>
  );
}
