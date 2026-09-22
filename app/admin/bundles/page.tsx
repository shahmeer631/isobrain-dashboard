"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Plus } from "lucide-react";
import { BundleCard } from "@/components/dashboard/(admin)/bundles/BundleCard";
import { CreateBundleModal } from "@/components/dashboard/(admin)/bundles/CreateBundleModal";
import { EditBundleModal } from "@/components/dashboard/(admin)/bundles/EditBundleModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { IBundle } from "@/types/bundles";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useGetBundlesQuery, 
  useUpdateBundleMutation,
  useDeleteBundleMutation
} from "@/lib/redux/features/course/bundleApi";

export default function BundlesPage() {
  const [updateBundle] = useUpdateBundleMutation();
  const [deleteBundle, { isLoading: isDeleting }] = useDeleteBundleMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Standards");
  const itemsPerPage = 8;

  const { data: bundlesData, isLoading, isError } = useGetBundlesQuery({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<IBundle | null>(null);
  const [deletingBundleId, setDeletingBundleId] = useState<string | null>(null);

  const bundlesList = useMemo(() => {
    return bundlesData?.data || [];
  }, [bundlesData]);

  const handleArchive = async (id: string, currentStatus: string) => {
    const isRestoring = currentStatus === "ARCHIVED";
    const newStatus = isRestoring ? "DRAFT" : "ARCHIVED";
    const actionLabel = isRestoring ? "restoring" : "archiving";

    try {
      const response = await updateBundle({
        id,
        body: { status: newStatus as "ACTIVE" | "DRAFT" | "ARCHIVED" }
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || `Bundle ${isRestoring ? "restored" : "archived"} successfully`);
      } else {
        toast.error(response?.message || `Failed to ${actionLabel} bundle`);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || `Failed to ${actionLabel} bundle`);
    }
  };

  const handleDelete = async () => {
    if (!deletingBundleId) return;

    try {
      const response = await deleteBundle(deletingBundleId).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Bundle deleted successfully");
        setIsDeleteOpen(false);
        setDeletingBundleId(null);
      } else {
        toast.error(response?.message || "Failed to delete bundle");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete bundle");
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="flex-1 h-11" />
            <Skeleton className="flex-1 h-11" />
            <Skeleton className="w-11 h-11" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="Course Bundles"
        subtitle="Create and manage course bundles with special pricing"
        actions={
          <Button
            variant="primary"
            className="h-11 shadow-indigo-200"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Bundle
          </Button>
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={statusFilter}
        setActiveFilter={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
        }}
        filters={["All Standards", "Active", "Draft", "Archived"]}
        placeholder="Search bundles..."
      />

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium text-lg">Failed to load bundles.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : bundlesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundlesList.map((bundle: IBundle) => (
            <BundleCard
              key={bundle.id}
              {...bundle}
              onEdit={() => {
                setEditingBundle(bundle);
                setIsEditOpen(true);
              }}
              onArchive={() => handleArchive(bundle.id, bundle.status)}
              onDelete={() => {
                setDeletingBundleId(bundle.id);
                setIsDeleteOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
             <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No bundles found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </div>
      )}

      {/* Pagination */}
      {bundlesData?.meta && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(bundlesData.meta.total / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <CreateBundleModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={(bundle) => {
          setIsCreateOpen(false);
          toast.success("Bundle created successfully");
          console.log("New bundle:", bundle);
        }}
      />

      <EditBundleModal
        bundle={editingBundle}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEdit={(bundle) => {
          console.log("Updated bundle:", bundle);
        }}
      />

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </Container>
  );
}
