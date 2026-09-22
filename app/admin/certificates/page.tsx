"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CertificateStats } from "@/components/dashboard/(admin)/certificates/CertificateStats";
import { CertificateCard } from "@/components/dashboard/(admin)/certificates/CertificateCard";
import { CertificateModal } from "@/components/dashboard/(admin)/certificates/CertificateModal";
import { CertificatePreviewModal } from "@/components/dashboard/(admin)/certificates/CertificatePreviewModal";
import { CertificateCardSkeleton } from "@/components/dashboard/(admin)/certificates/CertificateSkeleton";
import Container from "@/components/ui/container";
import {
  useGetCertificatesDashboardQuery,
  useCreateCertificateTemplateMutation,
  useUpdateCertificateTemplateMutation,
} from "@/lib/redux/features/certificates/certificateApi";
import {
  ICertificateTemplate,
  ICreateCertificateRequest,
} from "@/types/certificateTypes";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificatesPage() {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetCertificatesDashboardQuery();
  const [createCertificate, { isLoading: isCreating }] =
    useCreateCertificateTemplateMutation();
  const [updateCertificate, { isLoading: isUpdating }] =
    useUpdateCertificateTemplateMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<ICertificateTemplate | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "design">(
    "create",
  );

  const filters = ["All", "Active", "Inactive"];

  const filteredCertificates = React.useMemo(() => {
    const list = dashboardData?.data?.templates || [];
    return list.filter((cert) => {
      const matchesSearch =
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.templateType?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const status = cert.isActive ? "Active" : "Inactive";
      const matchesFilter = activeFilter === "All" || status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [dashboardData, searchQuery, activeFilter]);

  const handleCreateNew = () => {
    setEditingCertificate(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (cert: ICertificateTemplate) => {
    setEditingCertificate(cert);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDesign = (cert: ICertificateTemplate) => {
    setEditingCertificate(cert);
    setModalMode("design");
    setIsModalOpen(true);
  };

  const handlePreview = (cert: ICertificateTemplate) => {
    setEditingCertificate(cert);
    setIsPreviewOpen(true);
  };

  const handleSave = async (certData: Partial<ICreateCertificateRequest>) => {
    try {
      if (editingCertificate) {
        const res = await updateCertificate({
          id: editingCertificate.id,
          body: certData,
        }).unwrap();
        if (res.success) {
          toast.success(res.message || "Certificate updated successfully");
          setIsModalOpen(false);
        }
      } else {
        const res = await createCertificate(
          certData as ICreateCertificateRequest,
        ).unwrap();
        if (res.success) {
          toast.success(res.message || "Certificate created successfully");
          setIsModalOpen(false);
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to save certificate");
    }
  };

  const renderSkeletons = () => (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <CertificateCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="Certificates"
        subtitle="Create certificate templates and manage auto-issue settings"
        actions={
          <Button
            onClick={handleCreateNew}
            className=" h-11 px-6"
            variant={"primary"}
          >
            <Plus className="w-5 h-5" />
            Create Certificate
          </Button>
        }
      />

      <CertificateStats
        stats={dashboardData?.data?.stats}
        isLoading={isLoading}
      />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
        placeholder="Search templates..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          renderSkeletons()
        ) : isError ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-rose-500 font-medium">
              Failed to load certificates. Please try again.
            </p>
          </div>
        ) : filteredCertificates.length > 0 ? (
          filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onDesign={handleDesign}
            />
          ))
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              No certificate templates found matching your search.
            </p>
          </div>
        )}
      </div>

      <CertificateModal
        key={isModalOpen ? editingCertificate?.id || "new" : "closed"}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSave}
        editingCertificate={editingCertificate}
        mode={modalMode}
        isLoading={isCreating || isUpdating}
      />

      <CertificatePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        certificate={editingCertificate}
      />
    </Container>
  );
}
