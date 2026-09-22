"use client";

import React, { useState, useMemo } from "react";
import { Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import {
  UserTable,
  User,
} from "@/components/dashboard/(admin)/users/UserTable";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageUsersModal,
  AddGroupModal,
  EnrollCourseModal,
  UnenrollCourseModal,
} from "@/components/dashboard/(admin)/users/UserActions";
import { UserDetailsModal } from "@/components/dashboard/(admin)/users/UserDetailsModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { useGetUsersQuery, useDeleteUserMutation, useEnrollUsersMutation, useUnenrollUsersMutation, useBulkDeleteUsersMutation, ApiUser } from "@/lib/redux/api/userApi";
import { useAddUsersToGroupMutation } from "@/lib/redux/features/groups/groupApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Small utility to handle relative time formatting
const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Users");

  // Actions State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  // Modal States
  const [modals, setModals] = useState({
    view: false,
    edit: false,
    message: false,
    addGroup: false,
    enroll: false,
    unenroll: false,
    delete: false,
  });

  const { data: usersResponse, isLoading } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [bulkDeleteUsers, { isLoading: isBulkDeleting }] = useBulkDeleteUsersMutation();
  const [enrollUsers, { isLoading: isEnrolling }] = useEnrollUsersMutation();
  const [unenrollUsers, { isLoading: isUnenrolling }] = useUnenrollUsersMutation();
  const [addUsersToGroup, { isLoading: isAddingToGroup }] = useAddUsersToGroupMutation();

  const handleAddGroupConfirm = async (groupId: string) => {
    if (bulkIds.length === 0) {
      toast.error("No users selected");
      return;
    }

    try {
      const response = await addUsersToGroup({ groupId, userIds: bulkIds }).unwrap();
      if (response.success) {
        toast.success(response.message || "Users added to group successfully!");
        toggleModal("addGroup", false);
        setBulkIds([]);
      } else {
        toast.error(response.message || "Failed to add users to group");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to add users to group");
    }
  };

  const handleEnrollConfirm = async (courseId: string) => {
    if (bulkIds.length === 0) {
      toast.error("No users selected");
      return;
    }

    try {
      const response = await enrollUsers({ courseId, userIds: bulkIds }).unwrap();
      if (response.success) {
        toast.success(response.message || "Users enrolled successfully!");
        toggleModal("enroll", false);
        setBulkIds([]);
      } else {
        toast.error(response.message || "Failed to enroll users");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to enroll users");
    }
  };

  const handleUnenrollConfirm = async (courseId: string) => {
    if (bulkIds.length === 0) {
      toast.error("No users selected");
      return;
    }

    try {
      const response = await unenrollUsers({ courseId, userIds: bulkIds }).unwrap();
      if (response.success) {
        toast.success(response.message || "Users unenrolled successfully!");
        toggleModal("unenroll", false);
        setBulkIds([]);
      } else {
        toast.error(response.message || "Failed to unenroll users");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to unenroll users");
    }
  };

  const handleDeleteConfirm = async () => {
    if (bulkIds.length === 0) return;

    try {
      if (bulkIds.length === 1) {
        const response = await deleteUser(bulkIds[0]).unwrap();
        if (response.success) {
          toast.success(response.message || "User deleted successfully!");
          toggleModal("delete", false);
          setBulkIds([]);
        } else {
          toast.error(response.message || "Failed to delete user");
        }
      } else {
        const response = await bulkDeleteUsers({ userIds: bulkIds }).unwrap();
        if (response.success) {
          toast.success(response.message || "Users deleted successfully!");
          toggleModal("delete", false);
          setBulkIds([]);
        } else {
          toast.error(response.message || "Failed to bulk delete users");
        }
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to delete users");
    }
  };

  // Transform data to match the component expectations
  const users: User[] = useMemo(() => {
    if (!usersResponse?.data) return [];
    
    return usersResponse.data.map((apiUser: ApiUser) => ({
      id: apiUser.id,
      name: `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim() || "N/A",
      email: apiUser.email,
      enrollments: apiUser.enrollmentsCount,
      amountSpent: `$${apiUser.totalSpent.toLocaleString()}`,
      joinDate: new Date(apiUser.createdAt).toLocaleDateString(),
      lastActive: formatRelativeTime(apiUser.lastLoginAt),
      status: apiUser.status === "ACTIVE" ? "Active" : "Inactive",
    }));
  }, [usersResponse]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Users" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Frontend Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCustomLimit, setIsCustomLimit] = useState(false);
  
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = itemsPerPage > 0 ? Math.ceil(filteredUsers.length / itemsPerPage) : 1;

  const toggleModal = (key: keyof typeof modals, state: boolean) => {
    setModals((prev) => ({ ...prev, [key]: state }));
  };

  const handleDeleteSingle = (user: User) => {
    setBulkIds([user.id]);
    toggleModal("delete", true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    toggleModal("view", true);
  };

  const handleExportUsers = () => {
    if (filteredUsers.length === 0) {
      toast.error("No users to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Status", "Enrollments", "Amount Spent", "Join Date", "Last Active"];
    
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(u => [
        `"${u.id.replace(/"/g, '""')}"`,
        `"${u.name.replace(/"/g, '""')}"`,
        `"${u.email.replace(/"/g, '""')}"`,
        `"${u.status.replace(/"/g, '""')}"`,
        `"${u.enrollments}"`,
        `"${u.amountSpent.replace(/"/g, '""')}"`,
        `"${u.joinDate.replace(/"/g, '""')}"`,
        `"${u.lastActive.replace(/"/g, '""')}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filteredUsers.length} users exported successfully`);
  };

  return (
    <Container>
      <PageHeader
        title="User Management"
        subtitle="View, manage, and engage with your users"
        className="mb-8"
        actions={
          <Button
            variant={"primary"}
            className=" h-11 px-6 shadow-lg shadow-blue-500/20"
            onClick={handleExportUsers}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={statusFilter}
        setActiveFilter={setStatusFilter}
        filters={["All Users", "Active", "Inactive"]}
        placeholder="Search by name, email, or ID..."
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className={`h-4 ${i === 1 ? 'w-8' : 'w-24'} bg-slate-100 dark:bg-slate-800`} />
            ))}
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5 rounded bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-800" />
                    <Skeleton className="h-3 w-48 bg-slate-50 dark:bg-slate-800/50" />
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <Skeleton className="h-4 w-16 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <Skeleton className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
             <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-800" />
             <div className="flex gap-2">
               <Skeleton className="h-10 w-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
               <Skeleton className="h-10 w-32 rounded-xl bg-slate-100 dark:bg-slate-800" />
               <Skeleton className="h-10 w-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main User Table */}
          <UserTable
            users={paginatedUsers}
            onDeleteSingle={handleDeleteSingle}
            onView={handleView}
            onBulkMessage={(ids) => {
              setBulkIds(ids);
              toggleModal("message", true);
            }}
            onBulkAddGroup={(ids) => {
              setBulkIds(ids);
              toggleModal("addGroup", true);
            }}
            onBulkEnroll={(ids) => {
              setBulkIds(ids);
              toggleModal("enroll", true);
            }}
            onBulkUnenroll={(ids) => {
              setBulkIds(ids);
              toggleModal("unenroll", true);
            }}
            onBulkDelete={(ids) => {
              setBulkIds(ids);
              toggleModal("delete", true);
            }}
          />

          {/* Pagination Controls */}
          {totalPages >= 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/30 dark:bg-slate-800/30 -mt-px border border-t border-slate-100 dark:border-slate-800 rounded-b-2xl gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredUsers.length}</span> users
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">Rows per page:</span>
                  <Select 
                    value={isCustomLimit ? "custom" : itemsPerPage.toString()} 
                    onValueChange={(v) => { 
                      if (v === "custom") {
                        setIsCustomLimit(true);
                      } else {
                        setIsCustomLimit(false);
                        setItemsPerPage(Number(v)); 
                        setCurrentPage(1); 
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[95px] rounded-lg text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50, 100].map(limit => (
                        <SelectItem key={limit} value={limit.toString()}>{limit}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {isCustomLimit && (
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={itemsPerPage || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setItemsPerPage(val);
                          setCurrentPage(1);
                        } else if (e.target.value === "") {
                          setItemsPerPage(0); // Handle empty state gracefully
                        }
                      }}
                      className="h-8 w-[70px] rounded-lg text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-2"
                      placeholder="Qty"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="rounded-xl border-slate-200 dark:border-slate-800 h-10 px-4 font-bold disabled:opacity-50"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "h-10 w-10 rounded-xl font-bold",
                        currentPage === i + 1 
                          ? "bg-blue-600 text-white" 
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="rounded-xl border-slate-200 dark:border-slate-800 h-10 px-4 font-bold disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Management Modals */}
      <UserDetailsModal
        open={modals.view}
        onOpenChange={(s) => toggleModal("view", s)}
        user={selectedUser}
      />
      <MessageUsersModal
        open={modals.message}
        onOpenChange={(s) => toggleModal("message", s)}
        count={bulkIds.length}
      />
      <AddGroupModal
        open={modals.addGroup}
        onOpenChange={(s) => toggleModal("addGroup", s)}
        count={bulkIds.length}
        onConfirm={handleAddGroupConfirm}
        isLoading={isAddingToGroup}
      />
      <EnrollCourseModal
        open={modals.enroll}
        onOpenChange={(s) => toggleModal("enroll", s)}
        count={bulkIds.length}
        onConfirm={handleEnrollConfirm}
        isLoading={isEnrolling}
      />
      <UnenrollCourseModal
        open={modals.unenroll}
        onOpenChange={(s) => toggleModal("unenroll", s)}
        count={bulkIds.length}
        onConfirm={handleUnenrollConfirm}
        isLoading={isUnenrolling}
      />
      <DeleteConfirmationModal
        open={modals.delete}
        onOpenChange={(s) => toggleModal("delete", s)}
        title={bulkIds.length === 1 ? "Delete User" : "Delete Users"}
        description={
          bulkIds.length === 1
            ? "Are you sure you want to delete this user? This action cannot be undone and will remove all their course progress and history."
            : `Are you sure you want to delete ${bulkIds.length} users? This action cannot be undone.`
        }
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting || isBulkDeleting}
      />
    </Container>
  );
}
