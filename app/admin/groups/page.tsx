"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  GroupCard,
  GroupData,
} from "@/components/dashboard/(admin)/users/GroupCard";
import { GroupModal } from "@/components/dashboard/(admin)/users/GroupModal";
import { ManageGroupMembersModal } from "@/components/dashboard/(admin)/users/ManageGroupMembersModal";
import Container from "@/components/ui/container";
import {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from "@/lib/redux/features/groups/groupApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";

export default function UserGroupsPage() {
  const { data: groupsData, isLoading, isError } = useGetGroupsQuery();

  const groups: GroupData[] = React.useMemo(() => {
    return groupsData?.data?.data || [];
  }, [groupsData]);

  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupData | null>(null);
  const [managingGroup, setManagingGroup] = useState<GroupData | null>(null);

  const handleCreateNew = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group: GroupData) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (_id: string, group: GroupData) => {
    setGroupToDelete(group);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      const response = await deleteGroup(groupToDelete.id).unwrap();
      if (response?.success) {
        toast.success(response.message || "Group deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete group");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "An error occurred");
    } finally {
      setGroupToDelete(null);
    }
  };

  const handleSave = async (groupPartial: Partial<GroupData>) => {
    try {
      const payload = {
        name: groupPartial.name,
        description: groupPartial.description,
        permissions: groupPartial.permissions,
      };

      if (editingGroup) {
        const response = await updateGroup({
          id: editingGroup.id,
          body: payload,
        }).unwrap();
        if (response?.success) {
          toast.success(response.message || "Group updated successfully");
          setIsModalOpen(false);
        } else {
          toast.error(response?.message || "Failed to update group");
        }
      } else {
        const response = await createGroup(payload).unwrap();
        if (response?.success) {
          toast.success(
            response.message || "User group created successfully.",
          );
          setIsModalOpen(false);
        } else {
          toast.error(response?.message || "Failed to create group");
        }
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-11 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="User Groups"
        subtitle="Grant Plus / Pro / Ultra access to promotional or offline users without changing their subscriptions"
        actions={
          <Button onClick={handleCreateNew} className="h-11" variant="primary">
            <Plus className="w-5 h-5" />
            Create Group
          </Button>
        }
      />

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-bold text-lg">
            Failed to load groups
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group: GroupData) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete(id, group)}
              onManageUsers={setManagingGroup}
            />
          ))}

          {groups?.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium">
                No user groups have been created yet.
              </p>
            </div>
          )}
        </div>
      )}

      <GroupModal
        key={isModalOpen ? editingGroup?.id || "new" : "closed"}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSave}
        editingGroup={editingGroup}
        isSaving={isCreating || isUpdating}
      />

      <ManageGroupMembersModal
        open={!!managingGroup}
        onOpenChange={(open) => !open && setManagingGroup(null)}
        group={managingGroup}
      />

      <DeleteConfirmationModal
        open={!!groupToDelete}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Group"
        description="Are you sure you want to delete this group? Members will lose only the access granted by this group. Users, subscriptions, and payment records will not be deleted."
        isLoading={isDeleting}
      />
    </Container>
  );
}
