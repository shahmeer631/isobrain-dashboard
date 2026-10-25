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
    <div className="ib-card space-y-5 p-5">
      <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full group lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ib-mute)] transition-colors group-focus-within:text-[var(--ib-acc)]" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-[10px] border-[var(--ib-line)] bg-[var(--ib-bg)] pl-10 font-medium focus-visible:ring-[var(--ib-acc)]/25"
          />
        </div>

        <div className="flex w-full items-center rounded-[10px] border border-[var(--ib-line)] bg-[var(--ib-bg)] p-1 lg:w-auto">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-[8px] px-5 py-2 text-sm font-semibold transition-all lg:flex-none",
                activeStatus === status
                  ? "bg-[var(--ib-acc)] text-[var(--ib-on)]"
                  : "text-[var(--ib-mute)] hover:text-[var(--ib-ink)]"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--ib-line)] pt-4">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all",
              activeCategory === category
                ? "border-[var(--ib-acc)] bg-[var(--ib-acc)] text-[var(--ib-on)]"
                : "border-[var(--ib-line)] bg-[var(--ib-card)] text-[var(--ib-mute)] hover:border-[var(--ib-acc)]/40 hover:text-[var(--ib-acc)]"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
