"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import DocumentCard from "@/components/dashboard/(admin)/document/DocumentCard";
import { EditDocumentModal } from "@/components/dashboard/(admin)/document/EditDocumentModal";
import { UploadDocumentModal } from "@/components/dashboard/(admin)/document/UploadDocumentModal";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Document, DocumentStatus } from "@/types/document";
import { Pagination } from "@/components/dashboard/Pagination";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { BulkUploadDocumentModal } from "../../../components/dashboard/(admin)/document/BulkUploadDocumentModal";
import { 
  useGetDocumentsQuery, 
  useDeleteDocumentMutation 
} from "@/lib/redux/features/document/documentApi";

export default function DocumentLibraryPage() {
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DocumentStatus | "All" | "All Documents">("All Documents");
  const itemsPerPage = 6;

  const { data: documentsData, isLoading, isError } = useGetDocumentsQuery({
    search: searchQuery,
    status: activeTab === "All Documents" ? "" : activeTab,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const filteredDocuments = useMemo(() => {
    return documentsData?.data || [];
  }, [documentsData]);

  const handleUpload = () => {
    // RTK Query handles refetch via invalidatesTags
  };

  const handleEdit = () => {
    // RTK Query handles refetch via invalidatesTags
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        const response = await deleteDocument(documentToDelete.id).unwrap();
        if (response?.success) {
          toast.success("Document deleted successfully");
        } else {
          toast.error(response?.message || "Failed to delete document");
        }
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "An error occurred");
      } finally {
        setDocumentToDelete(null);
      }
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 xl:p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-5 w-16 px-2.5 py-0.5 rounded-md text-[12px]" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="col-span-2 h-10 w-full" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-10 h-10 shrink-0" />
            <Skeleton className="w-10 h-10 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="Document Library"
        subtitle="Manage templates and resources"
        actions={
          <>
          <Button
            variant="outline"
            className="h-11 shadow-indigo-200"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            Bulk Upload
          </Button>
          <Button
            variant="primary"
            className="h-11 shadow-indigo-200"
            onClick={() => setIsUploadOpen(true)}
            >
            <Plus className="w-5 h-5 mr-2" />
            Upload Document
          </Button>
            </>
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeTab}
        setActiveFilter={(filter) => {
          setActiveTab(filter as DocumentStatus | "All Documents");
          setCurrentPage(1);
        }}
        filters={["All Documents", "Active", "Draft"]}
        placeholder="Search documents by title or category..."
      />

      {/* Grid */}
      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-bold text-lg">
            Failed to load documents
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-bold text-lg">
            No documents found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc: Document) => (
            <DocumentCard
              key={doc.id}
              {...doc}
              onEdit={() => setEditingDocument(doc)}
              onDelete={() => handleDeleteClick(doc)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {documentsData?.meta && documentsData.meta.total > itemsPerPage && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(documentsData.meta.total / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      <UploadDocumentModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleUpload}
      />
      <BulkUploadDocumentModal
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
      <EditDocumentModal
        document={editingDocument}
        open={!!editingDocument}
        onOpenChange={(open) => !open && setEditingDocument(null)}
        onEdit={handleEdit}
      />
      <DeleteConfirmationModal
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Container>
  );
}
