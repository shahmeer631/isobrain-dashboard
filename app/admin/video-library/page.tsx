"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";

import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { EditVideoModal } from "@/components/dashboard/(admin)/video-library/EditVideoModal";
import { UploadVideoModal } from "@/components/dashboard/(admin)/video-library/UploadVideoModal";
import { VideoCard } from "@/components/dashboard/(admin)/video-library/VideoCard";
import { VideoDetailsModal } from "@/components/dashboard/(admin)/video-library/VideoDetailsModal";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteVideoMutation,
  useGetVideosQuery,
} from "@/lib/redux/features/video/videoApi";
import { IVideo } from "@/types/videoTypes";
import { toast } from "sonner";

export default function VideoLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // matching layout

  const {
    data: videosData,
    isLoading,
    isError,
  } = useGetVideosQuery({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingVideo, setEditingVideo] = useState<IVideo | null>(null);
  const [viewingVideo, setViewingVideo] = useState<IVideo | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const videosList = React.useMemo(() => {
    return videosData?.data || [];
  }, [videosData]);

  const handleDelete = async () => {
    if (!deletingVideoId) return;

    try {
      const response = await deleteVideo(deletingVideoId).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Video deleted successfully");
        setIsDeleteOpen(false);
        setDeletingVideoId(null);
      } else {
        toast.error(response?.message || "Failed to delete video");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete video");
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 xl:p-6 shadow-sm h-full"
        >
          <Skeleton className="relative aspect-video rounded-lg mb-6 w-full" />
          <div className="flex-1 mb-6">
            <div className="flex justify-between items-start gap-4 mb-2">
              <Skeleton className="h-6 w-3/4 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex items-center justify-between gap-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="flex-1 h-11" />
            <Skeleton className="w-11 h-11 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="Video Library"
        subtitle="Manage video content and tutorials"
        actions={
          <Button
            variant="primary"
            className="h-11 shadow-indigo-200"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Video
          </Button>
        }
      />
      <FilterBar
        activeFilter={statusFilter}
        filters={["All", "Published", "Draft"]}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveFilter={(filter) => {
          setStatusFilter(filter);
          setCurrentPage(1);
        }}
        placeholder="Search videos by title..."
      />

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium text-lg">
            Failed to load videos.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : videosList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videosList.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              // category={video.category?.name || "Uncategorized"}
              status={video.status === "PUBLISHED" ? "Published" : "Draft"}
              duration={video.duration || "N/A"}
              views={video.views?.toString() || "0"}
              description={video.description}
              uploadedAt={new Date(video.createdAt).toLocaleDateString()}
              onEdit={() => {
                setEditingVideo(video);
                setIsEditOpen(true);
              }}
              onDelete={() => {
                setDeletingVideoId(video.id);
                setIsDeleteOpen(true);
              }}
              onClick={() => {
                setViewingVideo(video);
                setIsViewOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No videos found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      {videosData?.meta && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(videosData.meta.total / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <UploadVideoModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={() => {
          // Handled by RTK invalidation
        }}
      />

      {editingVideo && (
        <EditVideoModal
          video={editingVideo as IVideo} // Explicitly typing
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onEdit={() => {
            // Handled by RTK Query invalidation
          }}
        />
      )}

      {viewingVideo && (
        <VideoDetailsModal
          video={viewingVideo}
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
        />
      )}

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
      />
    </Container>
  );
}
