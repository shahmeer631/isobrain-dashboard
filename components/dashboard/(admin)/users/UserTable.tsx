"use client";

import React, { useState } from "react";
import { Mail, UserPlus, BookOpen, UserMinus, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface User {
  id: string;
  name: string;
  email: string;
  enrollments: number;
  amountSpent: string;
  joinDate: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

interface UserTableProps {
  users: User[];
  onDeleteSingle: (user: User) => void;
  onView: (user: User) => void;
  onBulkMessage: (userIds: string[]) => void;
  onBulkAddGroup: (userIds: string[]) => void;
  onBulkEnroll: (userIds: string[]) => void;
  onBulkUnenroll: (userIds: string[]) => void;
  onBulkDelete: (userIds: string[]) => void;
}

export function UserTable({
  users,
  onDeleteSingle,
  onView,
  onBulkMessage,
  onBulkAddGroup,
  onBulkEnroll,
  onBulkUnenroll,
  onBulkDelete,
}: UserTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === users.length && users.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-300 ml-2">
            {selectedIds.length} users selected
          </p>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl h-10 px-4"
              onClick={() => onBulkMessage(selectedIds)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Message Users
            
              </Button>
            */}
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl h-10 px-4"
              onClick={() => onBulkAddGroup(selectedIds)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Group
            </Button>{" "}
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl h-10 px-4"
              onClick={() => onBulkEnroll(selectedIds)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Enroll in Course
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl h-10 px-4"
              onClick={() => onBulkUnenroll(selectedIds)}
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Unenroll
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-900 border-white dark:border-slate-800 text-rose-600 hover:text-rose-700 font-bold rounded-xl h-10 px-4"
              onClick={() => onBulkDelete(selectedIds)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 w-[60px]">
                  <Checkbox
                    checked={
                      users.length > 0 && selectedIds.length === users.length
                    }
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Name
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Email
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Enrollments
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Amount Spent
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Join Date
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Last Active
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="p-5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "group transition-colors",
                      selectedIds.includes(user.id)
                        ? "bg-blue-50/30 dark:bg-blue-900/10"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-800">
                          <AvatarFallback className="bg-blue-600 text-white font-bold text-xs uppercase">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500">
                      {user.email}
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {user.enrollments}
                      </span>
                      <span className="text-slate-400 ml-1 text-xs">
                        courses
                      </span>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-emerald-600">
                        {user.amountSpent}
                      </span>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500">
                      {user.joinDate}
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800 text-sm text-slate-500">
                      {user.lastActive}
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-bold border-none capitalize",
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                          onClick={() => onDeleteSingle(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                          onClick={() => onView(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-slate-500 italic"
                  >
                    No users found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
