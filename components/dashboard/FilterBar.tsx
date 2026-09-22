"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
  placeholder?: string;
  className?: string;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filters,
  placeholder = "Search...",
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm mb-8",
        className,
      )}
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 bg-slate-50 dark:bg-slate-800 border-none h-11 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px]"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "primary" : "outline"}
            className={cn(
              "rounded-xl px-6 h-11 text-[14px] font-bold shrink-0 transition-all",
              activeFilter === filter
                ? "text-white shadow-md shadow-indigo-100"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
}
