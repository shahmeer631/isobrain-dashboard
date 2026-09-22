"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionFilterProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export const TransactionFilter = React.memo(({ search, setSearch, status, setStatus }: TransactionFilterProps) => {
  const statuses = [
    { label: "All Status", value: "" },
    { label: "Completed", value: "SUCCEEDED" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-slate-100/50">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search by user, transaction ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 bg-slate-50 border border-slate-100 h-12 rounded-xl focus:bg-white transition-all text-[15px] placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
        {statuses.map((s) => (
          <Button
            key={s.label}
            variant={status === s.value ? "primary" : "outline"}
            onClick={() => setStatus(s.value)}
            className={cn(
              "h-11 px-6 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-300",
              status === s.value
                ? "shadow-lg shadow-blue-100 ring-2 ring-blue-500/10"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
            )}
          >
            {s.label === "All Status" && <Filter className="h-4 w-4" />}
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

TransactionFilter.displayName = "TransactionFilter";
