"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Archive, Trash2, ArchiveRestore, Package } from "lucide-react";

import { IBundle } from "@/types/bundles";

interface BundleCardProps extends IBundle {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function BundleCard({
  title,
  description,
  status,
  price,
  originalPrice,
  bundleItems,
  onEdit,
  onArchive,
  onDelete,
}: BundleCardProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[var(--ib-dk)] text-white";
      case "DRAFT":
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)]";
      case "ARCHIVED":
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)]";
      default:
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)]";
    }
  };

  const discountAmount = originalPrice - price;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return (
    <div className="flex flex-col bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      {/* Card Header: Icon & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--ib-accbg)] flex items-center justify-center text-[var(--ib-acc)]">
          <Package className="w-6 h-6" />
        </div>
        <Badge
          className={cn(
            "rounded-full px-3 py-1 font-bold text-[11px] border-none shadow-sm uppercase tracking-wider",
            getStatusClasses(status),
          )}
        >
          {status}
        </Badge>
      </div>

      {/* Title & Description */}
      <div className="mb-6">
        <h4 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-2 line-clamp-1">
          {title}
        </h4>
        <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-bold border-[var(--ib-line)] text-[var(--ib-mute)] uppercase tracking-tighter">
                {bundleItems?.length || 0} Courses Included
            </Badge>
        </div>
        <p className="text-sm font-medium text-[var(--ib-mute)] line-clamp-1">
          {description}
        </p>
      </div>

      {/* Price Banner */}
      <div className="bg-[#F0F9FF] dark:bg-blue-900/10 rounded-2xl p-4 mb-6 flex items-center justify-between relative overflow-hidden">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              ${price}
            </span>
            <span className="text-sm font-semibold text-[var(--ib-mute)] line-through">
              ${originalPrice}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-rose-500 hover:bg-rose-500 text-white border-none text-[11px] font-bold rounded-lg px-2">
            Save {discountPercentage}%
          </Badge>
          <span className="text-[11px] font-bold text-[var(--ib-mute)]">
            Bundle Offer
          </span>
        </div>
      </div>

      {/* Stats - Coming Soon or Hidden if no data */}
      {/* <div className="grid grid-cols-2 gap-4 mb-6 opacity-50">
        <div>
          <p className="text-[13px] text-[var(--ib-mute)] font-semibold mb-1">Total Sales</p>
          <p className="font-bold text-[16px] text-[var(--ib-ink)] dark:text-white">--</p>
        </div>
        <div>
          <p className="text-[13px] text-[var(--ib-mute)] font-semibold mb-1">Revenue</p>
          <p className="font-bold text-[16px] text-emerald-600">--</p>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] group/btn"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-[var(--ib-acc)] transition-colors" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] group/btn"
          onClick={onArchive}
        >
          {status === "ARCHIVED" ? (
            <>
              <ArchiveRestore className="w-4 h-4 mr-2 group-hover/btn:text-[var(--ib-acc)] transition-colors" />
              Restore
            </>
          ) : (
            <>
              <Archive className="w-4 h-4 mr-2 group-hover/btn:text-[var(--ib-acc)] transition-colors" />
              Archive
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
          onClick={onDelete}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
