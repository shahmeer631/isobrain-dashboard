"use client";

import React from "react";
import { Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function NextAchievement() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800 rounded-3xl p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
            Next Achievement
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-[14px] font-medium leading-relaxed">
            Complete 2 more courses to unlock the{" "}
            <span className="text-amber-600 font-bold">
              &quot;ISO Master&quot;
            </span>{" "}
            badge! 🏆
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Progress
          value={60}
          indicatorClassName="bg-amber-500 transition-all duration-700"
          className="h-2.5 bg-amber-100 dark:bg-amber-900/20"
        />
        <p className="text-[12px] font-black text-amber-600 uppercase tracking-widest text-center md:text-left">
          3 of 5 courses completed
        </p>
      </div>
    </div>
  );
}
