"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

interface UserActivityProps {
  activity?: Array<{
    day: string;
    users: number;
  }>;
}

export function UserActivity({ activity }: UserActivityProps) {
  // Find max count to calculate relative percentages if not provided
  const maxCount = Math.max(...(activity?.map((a) => a.users) || [1]));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm h-full">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-8">
        User Activity
      </h3>
      <div className="space-y-6">
        {(activity || []).map((item) => {
          const percentage = (item.users / maxCount) * 100;
          return (
            <div key={item.day} className="space-y-2">
              <div className="flex justify-between items-center text-[13px] font-bold">
                <span className="text-slate-900 dark:text-slate-200">
                  {item.day}
                </span>
                <span className="text-slate-400">
                  <span className="text-slate-900 dark:text-slate-200">
                    {item.users.toLocaleString()}
                  </span>{" "}
                  users
                </span>
              </div>
              <Progress
                value={percentage}
                className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"
                indicatorClassName="bg-gradient-to-r from-purple-600 to-indigo-600"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
