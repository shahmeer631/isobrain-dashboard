"use client";

import React, { useMemo, useState } from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { GroupData, planAccessLabel } from "./GroupCard";
import {
  useGetGroupQuery,
  useAddUsersToGroupMutation,
  useRemoveUserFromGroupMutation,
} from "@/lib/redux/features/groups/groupApi";
import { useGetUsersQuery } from "@/lib/redux/api/userApi";

interface ManageGroupMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupData | null;
}

export function ManageGroupMembersModal({
  open,
  onOpenChange,
  group,
}: ManageGroupMembersModalProps) {
  const [search, setSearch] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const {
    data: groupResponse,
    isFetching,
    isError,
  } = useGetGroupQuery(group?.id as string, {
    skip: !group?.id || !open,
  });

  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery(
    undefined,
    { skip: !open },
  );

  const [addUsers, { isLoading: isAdding }] = useAddUsersToGroupMutation();
  const [removeUser] = useRemoveUserFromGroupMutation();

  const detail = groupResponse?.data;
  const members = detail?.members || [];
  const memberIds = useMemo(
    () => new Set(members.map((m) => m.userId)),
    [members],
  );

  const allUsers = usersResponse?.data || [];

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allUsers
      .filter((u) => {
        if (memberIds.has(u.id)) return false;
        const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        return name.includes(q) || u.email.toLowerCase().includes(q);
      })
      .slice(0, 12);
  }, [allUsers, search, memberIds]);

  const handleAdd = async (userId: string) => {
    if (!group?.id) return;
    setPendingUserId(userId);
    try {
      const res = await addUsers({
        groupId: group.id,
        userIds: [userId],
      }).unwrap();
      toast.success(res.message || "User added to group");
      setSearch("");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to add user");
    } finally {
      setPendingUserId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!group?.id) return;
    setPendingUserId(userId);
    try {
      const res = await removeUser({
        groupId: group.id,
        userId,
      }).unwrap();
      toast.success(res.message || "User removed from group");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to remove user");
    } finally {
      setPendingUserId(null);
    }
  };

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={group ? `Manage Users — ${group.name}` : "Manage Users"}
      maxWidth="sm:max-w-[640px]"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Plan access summary */}
        <div>
          <p className="text-[13px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)] mb-2">
            Plan Access
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(detail?.permissions || group?.permissions || []).map((p) => (
              <Badge
                key={p}
                className="bg-[var(--ib-accbg)] text-[var(--ib-acc)] dark:bg-[var(--ib-acc)]/20 dark:text-[var(--ib-acc)] border-none"
              >
                {planAccessLabel(p)}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[var(--ib-mute)]">
            Removing a user only removes access from this group. Their normal
            subscription is never cancelled.
          </p>
        </div>

        {/* Add user search */}
        <div className="space-y-3">
          <p className="text-[13px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
            Add User
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ib-mute)]" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] border-none rounded-xl"
              disabled={usersLoading}
            />
          </div>

          {search.trim() && (
            <div className="rounded-xl border border-[var(--ib-line)] dark:border-[var(--ib-line)] divide-y divide-[var(--ib-line)] dark:divide-[var(--ib-line)] overflow-hidden">
              {usersLoading ? (
                <div className="flex items-center justify-center py-6 text-[var(--ib-mute)]">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading users…
                </div>
              ) : searchResults.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-[var(--ib-mute)]">
                  No users found.
                </p>
              ) : (
                searchResults.map((user) => {
                  const name =
                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    "Unnamed user";
                  const busy = pendingUserId === user.id && isAdding;
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[var(--ib-dk)]"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-white truncate">
                          {name}
                        </p>
                        <p className="text-[12px] text-[var(--ib-mute)] truncate">
                          {user.email}
                        </p>
                        <p className="text-[11px] text-[var(--ib-mute)] mt-0.5">
                          Subscription:{" "}
                          {user.subscribed === "SUBSCRIBED" && user.currentPlan
                            ? user.currentPlan
                            : user.currentPlan && user.currentPlan !== "FREE"
                              ? user.currentPlan
                              : "None"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        className="h-9 shrink-0"
                        disabled={!!pendingUserId}
                        onClick={() => handleAdd(user.id)}
                      >
                        {busy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Members list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Members
            </p>
            <span className="text-[12px] font-bold text-[var(--ib-mute)]">
              {members.length}
            </span>
          </div>

          {isFetching && !detail ? (
            <div className="flex items-center justify-center py-10 text-[var(--ib-mute)]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading members…
            </div>
          ) : isError ? (
            <p className="py-8 text-center text-[13px] text-red-500">
              Failed to load group members.
            </p>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-[var(--ib-mute)] border border-dashed border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl">
              No users have been added to this group yet.
            </p>
          ) : (
            <div className="rounded-xl border border-[var(--ib-line)] dark:border-[var(--ib-line)] divide-y divide-[var(--ib-line)] dark:divide-[var(--ib-line)] overflow-hidden">
              {members.map((m) => {
                const name =
                  [m.user.firstName, m.user.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unnamed user";
                const busy = pendingUserId === m.userId;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[var(--ib-dk)]"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-white truncate">
                        {name}
                      </p>
                      <p className="text-[12px] text-[var(--ib-mute)] truncate">
                        {m.user.email}
                      </p>
                      <p className="text-[11px] text-[var(--ib-mute)] mt-0.5">
                        {m.user.status}
                        {" · Subscription: "}
                        {m.user.currentPlan && m.user.currentPlan !== "FREE"
                          ? m.user.currentPlan
                          : "None"}
                        {m.dateAdded
                          ? ` · Added ${new Date(m.dateAdded).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 shrink-0 text-red-600 hover:bg-red-50 border-[var(--ib-line)]"
                      disabled={!!pendingUserId}
                      onClick={() => handleRemove(m.userId)}
                    >
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardModal>
  );
}
