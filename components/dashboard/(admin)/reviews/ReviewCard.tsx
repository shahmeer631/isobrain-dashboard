"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewData {
  id: string;
  userName: string;
  userImage?: string;
  courseName: string;
  rating: number;
  date: string;
  status: "Approved" | "Pending";
  comment: string;
}

interface ReviewCardProps {
  review: ReviewData;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function ReviewCard({
  review,
  onApprove,
  onDelete,
  onView,
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200 fill-slate-200",
        )}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 rounded-2xl">
            <AvatarImage src={review.userImage} />
            <AvatarFallback className="bg-indigo-600 text-white font-bold rounded-2xl">
              {review.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-[17px] font-bold text-slate-900 dark:text-white leading-none">
              {review.userName}
            </h4>
            <p className="text-[13px] text-slate-500 font-medium">
              {review.courseName}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(review.rating)}
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-[13px] text-slate-500 font-medium">
                {review.date}
              </span>
              <Badge
                className={cn(
                  "border-none px-2 py-0 h-5 text-[10px] font-bold rounded-md",
                  review.status === "Approved"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                )}
              >
                {review.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {review.status === "Pending" && (
            <Button
              variant="outline"
              className="h-10 rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/20 dark:hover:bg-emerald-900/10 font-bold flex items-center gap-2 px-4 shadow-sm"
              onClick={() => onApprove?.(review.id)}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 px-4 shadow-sm"
            onClick={() => onView?.(review.id)}
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 px-4 shadow-sm"
            onClick={() => onDelete?.(review.id)}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  );
}
