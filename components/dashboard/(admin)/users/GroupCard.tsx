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
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white leading-none">
              {group.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-none px-2 py-0 h-5 text-[10px] font-bold rounded-md">
                {group.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[14px] text-slate-500 font-medium mb-6 line-clamp-2 min-h-[40px]">
        {group.description || "No description"}
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[28px] font-bold text-indigo-600 leading-none mb-1">
            {(group.memberCount ?? group.totalMembers ?? 0).toLocaleString()}
          </span>
          <span className="text-[13px] font-bold text-slate-500">
            Total Members
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">
          Plan Access
        </p>
        <div className="flex flex-wrap gap-1.5">
          {plans.map((plan, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-none px-2.5 py-1 text-[11px] font-bold rounded-lg"
            >
              {planAccessLabel(plan)}
            </Badge>
          ))}
          {plans.length === 0 && (
            <span className="text-[12px] text-slate-400 italic">
              No plans assigned
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
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
            className="flex-1 h-11 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
            onClick={() => onEdit(group)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-slate-200 dark:border-slate-800 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all"
            onClick={() => onDelete(group.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
