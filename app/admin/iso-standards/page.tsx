"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Plus, Download, FileText } from "lucide-react";
import React, { useState } from "react";
import { ManagementCard } from "@/components/dashboard/ManagementCard";
import { UploadStandardModal } from "@/components/dashboard/(admin)/iso-standards/UploadStandardModal";
import { EditStandardModal } from "@/components/dashboard/(admin)/iso-standards/EditStandardModal";
import { ISOStandard } from "@/types/iso-standards";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { 
  useGetISOStandardsQuery, 
  useUpdateISOStandardMutation, 
  useDeleteISOStandardMutation 
} from "@/lib/redux/features/iso-standards/isoStandardApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/dashboard/Pagination";



export default function ISOStandardsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Standards");
  const itemsPerPage = 9;

  const { data: standardsData, isLoading, isError } = useGetISOStandardsQuery({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [updateISOStandard] = useUpdateISOStandardMutation();
  const [deleteISOStandard] = useDeleteISOStandardMutation();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<ISOStandard | null>(null);

  const standardsList = standardsData?.data || [];

  const handleArchive = async (id: string, currentStatus: string) => {
    const isRestoring = currentStatus === "ARCHIVED";
    const newStatus = isRestoring ? "DRAFT" : "ARCHIVED";
    
    try {
      const response = await updateISOStandard({
        id,
        body: { status: newStatus as "ACTIVE" | "DRAFT" | "ARCHIVED" }
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || `Standard ${isRestoring ? "restored" : "archived"} successfully`);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update standard status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteISOStandard(id).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Standard deleted successfully");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete standard");
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1) return `${(size * 1024).toFixed(1)} KB`;
    return `${size.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="flex-1 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="ISO Standards Library"
        subtitle="Manage and distribute ISO standard documents"
        actions={
          <Button
            variant="primary"
            className="h-11 shadow-indigo-200"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Standard
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
        placeholder="Search by title or category..."
      />

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium text-lg">Failed to load ISO standards.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : standardsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardsList.map((standard) => (
            <ManagementCard
              key={standard.id}
              id={standard.id}
              icon={<FileText className="w-6 h-6" />}
              tag="ISO Standard"
              title={standard.title}
              subtitle={standard.category?.name || "Uncategorized"}
              status={standard.status.charAt(0).toUpperCase() + standard.status.slice(1).toLowerCase()}
              stats={[
                { label: "Downloads", value: standard.downloads.toString() },
                {
                  label: "File Size",
                  value: formatFileSize(standard.fileSize),
                  isHighlight: true,
                },
                { label: "Updated", value: formatDate(standard.updatedAt) },
              ]}
              onEdit={() => {
                setEditingStandard(standard);
                setIsEditOpen(true);
              }}
              onPrimaryAction={() => {
                if (standard.fileUrl) window.open(standard.fileUrl, "_blank");
              }}
              primaryActionIcon={Download}
              primaryActionLabel="Download"
              onArchive={() => handleArchive(standard.id, standard.status)}
              onDelete={() => handleDelete(standard.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
             <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No standards found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </div>
      )}

      {/* Pagination */}
      {standardsData?.meta && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(standardsData.meta.total / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <UploadStandardModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={() => {
          setIsUploadOpen(false);
          toast.success("Standard uploaded successfully");
        }}
      />

      <EditStandardModal
        standard={editingStandard}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEdit={() => {
          setIsEditOpen(false);
          toast.success("Standard updated successfully");
        }}
      />
    </Container>
  );
}
