"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All", "In Progress", "Completed"];

const CATEGORY_FILTERS = [
  "All Courses",
  "Auditing",
  "Business Continuity",
  "Quality Management",
  "Compliance",
  "Information Security",
  "Environmental",
  "Health & Safety",
  "Risk Management",
];

interface CourseFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function CourseFilter({
  searchQuery,
  setSearchQuery,
  activeStatus,
  setActiveStatus,
  activeCategory,
  setActiveCategory,
}: CourseFilterProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl w-full lg:w-auto">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={cn(
                "flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                activeStatus === status
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-xl text-[12px] font-bold border transition-all whitespace-nowrap",
              activeCategory === category
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-600",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
