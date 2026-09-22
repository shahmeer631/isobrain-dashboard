"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { PlanTable } from "@/components/dashboard/(admin)/plans/PlanTable";
import { PlanModal } from "@/components/dashboard/(admin)/plans/PlanModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { IPlan } from "@/types/planTypes";
import {
  useDeletePlanMutation,
  useGetPlansQuery,
} from "@/lib/redux/features/plans/plansApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const PlansPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<IPlan | null>(null);

  const { data, isLoading, isError, isFetching } = useGetPlansQuery();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const handleAddNew = () => {
    setModalMode("create");
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: IPlan) => {
    setModalMode("edit");
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (plan: IPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      await deletePlan(planToDelete.id).unwrap();
      toast.success("Plan deactivated successfully");
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to deactivate plan");
    }
  };

  return (
    <Container>
      <div className="max-w-8xl mx-auto w-full flex flex-col gap-8">
        <PageHeader
          title="Subscription Plans"
          subtitle="Manage pricing plans and features for your users"
          actions={
            <Button
              onClick={handleAddNew}
              variant="primary"
              className="h-12 px-6 flex items-center gap-2  text-[14px] font-bold transition-all shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Add New Plan
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center">
            <p className="text-rose-500 font-bold">Failed to load plans. Please try again later.</p>
          </div>
        ) : (
          <PlanTable
            plans={data?.data || []}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isFetching={isFetching}
          />
        )}

        <PlanModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          mode={modalMode}
          initialData={selectedPlan}
        />

        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Deactivate Plan"
          description={`Are you sure you want to deactivate the "${planToDelete?.name}" plan? This will hide it from new users.`}
        />
      </div>
    </Container>
  );
};

export default PlansPage;