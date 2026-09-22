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
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 xl:p-6 shadow-sm hover:shadow-md transition-all group h-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
          <FileText className="w-6 h-6" />
        </div>
        <Badge
          className={cn(
            "rounded-md px-2.5 py-0.5 font-bold text-[12px] border-none shadow-sm uppercase tracking-wider",
            status === "ACTIVE"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
          )}
        >
          {status}
        </Badge>
      </div>

      {/* Info Area */}
      <div className="flex-1 mb-6">
        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-[13px] font-semibold text-slate-400 mb-4">
          {typeof category === 'object' && category !== null ? category.name : category}
        </p>

        <div className="grid grid-cols-2 gap-y-4 mb-6">
          <div>
            <p className="text-[13px] text-slate-500 font-semibold mb-0.5">
              Type
            </p>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white">
              {type}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-slate-500 font-semibold mb-0.5">
              Size
            </p>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white">
              {fileSize}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[13px] text-slate-500 font-semibold mb-0.5">
              Downloads
            </p>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white">
              {downloads}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 group/btn text-slate-900 dark:text-white"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-indigo-600 transition-colors" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0"
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
