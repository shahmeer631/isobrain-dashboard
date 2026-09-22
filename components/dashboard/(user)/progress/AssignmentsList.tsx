"use client";

import React from "react";
import { CheckCircle2, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ASSIGNMENTS_DATA = [
  {
    id: "1",
    title: "Quality Management System Documentation",
    course: "ISO 9001:2015",
    dueDate: "2024-02-25",
    progress: 65,
    status: "In Progress",
  },
  {
    id: "2",
    title: "Risk Assessment Project",
    course: "ISO 27001:2022",
    dueDate: "2024-03-10",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "3",
    title: "Environmental Impact Study",
    course: "ISO 14001:2015",
    dueDate: "2024-02-15",
    progress: 100,
    status: "Submitted",
  },
];

export function AssignmentsList() {
  const pendingCount = ASSIGNMENTS_DATA.filter(
    (a) => a.status !== "Submitted",
  ).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-8 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
          Assignments & Projects
        </h3>
        <span className="bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800 font-black text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wider">
          {pendingCount} Pending
        </span>
      </div>

      <div className="space-y-4">
        {ASSIGNMENTS_DATA.map((item) => (
          <div
            key={item.id}
            className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                  {item.status === "Submitted" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Target className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] font-bold text-slate-400">
                    {item.course}
                  </p>
                </div>
              </div>
              {item.status === "Submitted" && (
                <div className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                <span className="font-bold">Due: {item.dueDate}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                    item.status === "Submitted"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.status === "In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-600",
                  )}
                >
                  {item.status}
                </span>
              </div>
              {item.status !== "Not Started" && (
                <Progress
                  value={item.progress}
                  indicatorClassName={cn(
                    "transition-all duration-1000",
                    item.status === "Submitted"
                      ? "bg-emerald-500"
                      : "bg-indigo-600",
                  )}
                  className="h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
