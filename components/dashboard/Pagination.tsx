"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "primary" : "outline"}
            size="icon"
            className={cn(
              "w-10 h-10 rounded-xl font-bold",
              currentPage === i
                ? "shadow-md shadow-indigo-200 dark:shadow-none"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Logic for more than 5 pages with ellipses
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);

      // Always show first page
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "primary" : "outline"}
          size="icon"
          className={cn(
            "w-10 h-10 rounded-xl font-bold",
            currentPage === 1
              ? "shadow-md shadow-indigo-200 dark:shadow-none"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );

      if (startPage > 2) {
        pages.push(
          <div key="dots-start" className="flex items-center justify-center w-10 h-10">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        );
      }

      for (let i = Math.max(2, startPage); i <= Math.min(totalPages - 1, endPage); i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "primary" : "outline"}
            size="icon"
            className={cn(
              "w-10 h-10 rounded-xl font-bold",
              currentPage === i
                ? "shadow-md shadow-indigo-200 dark:shadow-none"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }

      if (endPage < totalPages - 1) {
        pages.push(
          <div key="dots-end" className="flex items-center justify-center w-10 h-10">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        );
      }

      // Always show last page
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "primary" : "outline"}
          size="icon"
          className={cn(
            "w-10 h-10 rounded-xl font-bold",
            currentPage === totalPages
              ? "shadow-md shadow-indigo-200 dark:shadow-none"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-10", className)}>
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">{renderPageButtons()}</div>

      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
