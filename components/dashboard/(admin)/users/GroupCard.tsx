"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, UserPlus } from "lucide-react";

export interface GroupMember {
  id: string;
  userId: string;
  dateAdded?: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    status: string;
    currentPlan?: string;
    role?: string;
  };
}

export interface GroupData {
  id: string;
  name: string;
  description: string;
  totalMembers?: number;
  memberCount?: number;
  status: "ACTIVE" | "INACTIVE" | "Active" | "Inactive";
  permissions: string[];
  planAccess?: string[];
  members?: GroupMember[];
  createdAt?: string;
  createdBy?: string | null;
}

interface GroupCardProps {
  group: GroupData;
  onEdit: (group: GroupData) => void;
  onDelete: (id: string) => void;
  onManageUsers: (group: GroupData) => void;
}

export const planAccessLabel = (value: string) => {
  const map: Record<string, string> = {
    PLUS: "ISO Brain Plus",
    PRO: "ISO Brain Pro",
    ULTRA: "ISO Brain Ultra",
  };
  return map[value?.toUpperCase()] || value;
};

export function GroupCard({
  group,
  onEdit,
  onDelete,
  onManageUsers,
}: GroupCardProps) {
  const plans = group.planAccess || group.permissions || [];

  return (
    <div className="flex flex-col bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/20 flex items-center justify-center text-[var(--ib-acc)]">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-[var(--ib-ink)] dark:text-white leading-none">
              {group.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-[var(--ib-acc)] text-white hover:bg-[var(--ib-acc)] border-none px-2 py-0 h-5 text-[10px] font-bold rounded-md">
                {group.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[14px] text-[var(--ib-mute)] font-medium mb-6 line-clamp-2 min-h-[40px]">
        {group.description || "No description"}
      </p>

      <div className="bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 rounded-2xl p-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[28px] font-bold text-[var(--ib-acc)] leading-none mb-1">
            {(group.memberCount ?? group.totalMembers ?? 0).toLocaleString()}
          </span>
          <span className="text-[13px] font-bold text-[var(--ib-mute)]">
            Total Members
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[13px] font-bold text-[var(--ib-ink)] dark:text-white mb-3">
          Plan Access
        </p>
        <div className="flex flex-wrap gap-1.5">
          {plans.map((plan, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[var(--ib-accbg)] text-[var(--ib-acc)] dark:bg-[var(--ib-acc)]/20 dark:text-[var(--ib-acc)] border-none px-2.5 py-1 text-[11px] font-bold rounded-lg"
            >
              {planAccessLabel(plan)}
            </Badge>
          ))}
          {plans.length === 0 && (
            <span className="text-[12px] text-[var(--ib-mute)] italic">
              No plans assigned
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[var(--ib-line)] dark:border-[var(--ib-line)]">
        <Button
          variant="primary"
          className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2"
          onClick={() => onManageUsers(group)}
        >
          <UserPlus className="w-4 h-4" />
          Manage Users
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)] font-bold text-[var(--ib-mute)] dark:text-[var(--ib-mute)] hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] flex items-center justify-center gap-2 transition-all"
            onClick={() => onEdit(group)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all"
            onClick={() => onDelete(group.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
