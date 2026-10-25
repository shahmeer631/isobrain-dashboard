"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Trash2, FileText, Download } from "lucide-react";
import { Document } from "@/types/document";

interface DocumentCardProps extends Document {
  onEdit: () => void;
  onDelete: () => void;
}

const DocumentCard = ({
  title,
  category,
  status,
  type,
  fileSize,
  downloads,
  fileUrl,
  onEdit,
  onDelete,
}: DocumentCardProps) => {
  return (
    <div className="flex flex-col bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-2xl p-4 xl:p-6 shadow-sm hover:shadow-md transition-all group h-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/20 p-3 rounded-xl text-[var(--ib-acc)]">
          <FileText className="w-6 h-6" />
        </div>
        <Badge
          className={cn(
            "rounded-md px-2.5 py-0.5 font-bold text-[12px] border-none shadow-sm uppercase tracking-wider",
            status === "ACTIVE"
              ? "bg-[var(--ib-acc)] text-white"
              : "bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] text-[var(--ib-mute)] dark:text-[var(--ib-mute)]",
          )}
        >
          {status}
        </Badge>
      </div>

      {/* Info Area */}
      <div className="flex-1 mb-6">
        <h4 className="text-[17px] font-bold text-[var(--ib-ink)] dark:text-white line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-[13px] font-semibold text-[var(--ib-mute)] mb-4">
          {typeof category === 'object' && category !== null ? category.name : category}
        </p>

        <div className="grid grid-cols-2 gap-y-4 mb-6">
          <div>
            <p className="text-[13px] text-[var(--ib-mute)] font-semibold mb-0.5">
              Type
            </p>
            <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white">
              {type}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[var(--ib-mute)] font-semibold mb-0.5">
              Size
            </p>
            <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white">
              {fileSize}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[13px] text-[var(--ib-mute)] font-semibold mb-0.5">
              Downloads
            </p>
            <p className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white">
              {downloads}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--ib-line)] dark:border-[var(--ib-line)]">
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] group/btn text-[var(--ib-ink)] dark:text-white"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-[var(--ib-acc)] transition-colors" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-[var(--ib-mute)] hover:text-[var(--ib-acc)] hover:bg-[var(--ib-accbg)] shrink-0"
          onClick={() => fileUrl && window.open(fileUrl, "_blank")}
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
          onClick={onDelete}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentCard;
