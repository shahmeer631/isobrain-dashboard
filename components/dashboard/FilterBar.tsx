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
        "flex flex-col md:flex-row items-center gap-4 bg-[var(--ib-card)] border border-[var(--ib-line)] rounded-2xl p-3 shadow-sm mb-8",
        className,
      )}
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--ib-mute)]" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 bg-[var(--ib-bg)] border-none h-11 rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] text-[var(--ib-ink)]"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "primary" : "outline"}
            className={cn(
              "rounded-[10px] px-6 h-11 text-[14px] font-bold shrink-0 transition-all",
              activeFilter === filter
                ? "text-white shadow-sm"
                : "border-[var(--ib-line)] text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-acc)]",
            )}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
}
