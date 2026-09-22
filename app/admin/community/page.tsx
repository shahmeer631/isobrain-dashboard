"use client";

import React, { useState, useCallback } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/dashboard/Pagination";
import CommunityCard from "@/components/dashboard/(admin)/community/CommunityCard";
import { CreateCommunityModal } from "@/components/dashboard/(admin)/community/CreateCommunityModal";
import { EditCommunityModal } from "@/components/dashboard/(admin)/community/EditCommunityModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import {
  useGetCommunitiesQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  ICommunity,
  CommunityVisibilityFilter,
} from "@/lib/redux/features/community/communityApi";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_LABELS = ["All", "Public", "Private"] as const;
type FilterLabel = (typeof FILTER_LABELS)[number];
const PAGE_SIZE = 8;

function toVisibilityParam(label: FilterLabel): CommunityVisibilityFilter {
  if (label === "Public") return "PUBLIC";
  if (label === "Private") return "PRIVATE";
  return "ALL";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity | null>(null);
  const [communityToDelete, setCommunityToDelete] = useState<ICommunity | null>(null);

  // ─── API hooks ──────────────────────────────────────────────────────────────
  const { data: response, isLoading, error } = useGetCommunitiesQuery({
    visibility: toVisibilityParam(activeFilter),
    search: searchQuery.trim() || undefined,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const [createCommunity, { isLoading: isCreating }] = useCreateCommunityMutation();
  const [updateCommunity] = useUpdateCommunityMutation();
  const [deleteCommunity, { isLoading: isDeleting }] = useDeleteCommunityMutation();

  // ─── Derived data ───────────────────────────────────────────────────────────
  const communities = response?.data?.data ?? [];
  const meta = response?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1;

  // Reset page when search or filter changes
  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((f: string) => {
    setActiveFilter(f as FilterLabel);
    setCurrentPage(1);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleCreate = async (formData: any) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.category,
        moderators: formData.moderators
          ? formData.moderators.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        visibility: formData.visibility === "Public" ? "PUBLIC" : "PRIVATE",
        allowPosts: formData.allowMemberPosts,
        requireApproval: formData.requireApproval,
        allowAttachments: formData.allowAttachments,
        emailNotifications: formData.sendNotifications,
        memberLimit: formData.memberLimit ? parseInt(formData.memberLimit) : null,
        rules: formData.rules || "",
        ...(formData.icon ? { icon: formData.icon } : {}),
      };

      await createCommunity(payload as any).unwrap();
      setIsCreateOpen(false);
      toast.success("Community created successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create community.");
    }
  };

  const handleEdit = async (formData: any) => {
    if (!selectedCommunity) return;
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.category,
        visibility: formData.visibility === "Public" ? "PUBLIC" : "PRIVATE",
        allowPosts: formData.allowMemberPosts ?? true,
        requireApproval: formData.requireApproval ?? false,
        allowAttachments: formData.allowAttachments ?? true,
        emailNotifications: formData.sendNotifications ?? true,
        moderators: formData.moderators
          ? formData.moderators.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        memberLimit:
          !formData.memberLimit || isNaN(Number(formData.memberLimit))
            ? null
            : Number(formData.memberLimit),
        rules: formData.rules || "",
        ...(formData.icon ? { icon: formData.icon } : {}),
      };

      await updateCommunity({ id: selectedCommunity.id, data: payload as any }).unwrap();
      toast.success("Community updated successfully!");
      setIsEditOpen(false);
      setSelectedCommunity(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update community.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!communityToDelete) return;
    try {
      await deleteCommunity(communityToDelete.id).unwrap();
      toast.success("Community deleted successfully!");
      setIsDeleteOpen(false);
      setCommunityToDelete(null);
      // If we deleted the last item on a page > 1, go back one page
      if (communities.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete community.");
    }
  };

  // ─── Skeleton ───────────────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-7 shadow-sm h-full"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>

          {/* Description */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-100/50 dark:border-slate-800/50"
              >
                <Skeleton className="h-7 w-8 mx-auto mb-2" />
                <Skeleton className="h-3 w-14 mx-auto" />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="flex-1 h-12 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container>
      <PageHeader
        title="Communities"
        subtitle="Manage discussion forums and groups"
        actions={
          <Button
            variant="primary"
            className="h-12 rounded-xl px-8 font-bold text-[15px] shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Create Community
          </Button>
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        activeFilter={activeFilter}
        setActiveFilter={handleFilterChange}
        filters={[...FILTER_LABELS]}
        placeholder="Search communities..."
      />

      {/* Content */}
      {isLoading ? (
        renderSkeleton()
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p>Error loading communities. Please try again later.</p>
        </div>
      ) : communities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                status={community.status}
                visibility={community.visibility}
                category={community.category?.name ?? "—"}
                members={community.membersCount.toString()}
                posts={community.postsCount}
                icon={community.icon}
                engagement={community.engagement}
                onEdit={() => {
                  setSelectedCommunity(community);
                  setIsEditOpen(true);
                }}
                onDelete={() => {
                  setCommunityToDelete(community);
                  setIsDeleteOpen(true);
                }}
              />
            ))}
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl border-dashed">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-1">
            No communities found
          </h3>
          <p className="text-slate-500 text-[14px]">
            {searchQuery ? "Try adjusting your search or filters." : "Create your first community!"}
          </p>
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <CreateCommunityModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      {selectedCommunity && (
        <EditCommunityModal
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setSelectedCommunity(null);
          }}
          community={selectedCommunity}
          onSubmit={handleEdit}
        />
      )}

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Community"
        description={`Are you sure you want to delete "${communityToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Container>
  );
};

export default CommunityPage;
