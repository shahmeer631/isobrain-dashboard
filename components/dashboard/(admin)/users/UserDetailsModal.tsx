"use client";

import React from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { User } from "./UserTable";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  DollarSign,
  GraduationCap,
  Clock,
  User as UserIcon,
} from "lucide-react";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailsModal({
  open,
  onOpenChange,
  user,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="User Details"
      maxWidth="max-w-xl"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 space-y-6">
        {/* Abstract Background Blobs for Premium Feel */}
        <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 -m-20 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative">
          {/* Header section */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-2xl bg-linear-to-tr from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/20">
                <div className="h-full w-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${
                    user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>
            <Badge
              className={`rounded-xl px-3 py-1 font-medium ${
                user.status === "Active"
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {user.status === "Active" ? "Active User" : "Inactive User"}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left-4 duration-500 fade-in fill-mode-both">
            <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-100/50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <UserIcon className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">User ID</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white truncate">
                {user.id}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-100/50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Enrolled Courses</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.enrollments} total
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-100/50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Join Date</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.joinDate}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-100/50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <DollarSign className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Amount Spent</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.amountSpent}
              </p>
            </div>
            
            <div className="col-span-2 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-100/50 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Clock className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">Last Active</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.lastActive}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardModal>
  );
}
