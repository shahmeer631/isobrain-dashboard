"use client";

import React, { useMemo, useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useUploadFilesMutation } from "@/lib/redux/features/upload/uploadApi";
import { useCreateBulkDocumentsMutation } from "@/lib/redux/features/document/documentApi";

interface BulkUploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadDocumentModal({
  open,
  onOpenChange,
}: BulkUploadDocumentModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];
  const [uploadFiles, { isLoading: isUploadingFiles }] = useUploadFilesMutation();
  const [createBulkDocuments, { isLoading: isCreatingDocuments }] = useCreateBulkDocumentsMutation();

  const isLoading = isUploadingFiles || isCreatingDocuments;

  const selectedLabel = useMemo(() => {
    if (files.length === 0) return "Click to upload or drag and drop";
    if (files.length === 1) return files[0].name;
    return `${files.length} files selected`;
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const clearSelection = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      toast.error("Category is required");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file, file.name);
      });

      const uploadResponse = await uploadFiles(formData).unwrap();
      const urls = uploadResponse.data?.urls || [];

      if (urls.length === 0) {
        toast.error(uploadResponse.message || "No files were uploaded");
        return;
      }

      const createResponse = await createBulkDocuments({
        categoryId,
        urls,
      }).unwrap();

      if (createResponse.success) {
        toast.success(createResponse.message || "Files uploaded successfully");
        clearSelection();
        setCategoryId("");
        onOpenChange(false);
      } else {
        toast.error(createResponse.message || "Failed to create documents");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to upload files");
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Bulk Upload Documents"
      maxWidth="sm:max-w-[720px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
            files.length
              ? "border-indigo-200 bg-indigo-50/30 dark:bg-indigo-900/10"
              : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx,.txt"
          />
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          {files.length ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[420px] text-center">
                {selectedLabel}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-[15px] font-bold text-slate-900 dark:text-white mb-1 text-center">
                Click to upload multiple files
              </p>
              <p className="text-[13px] text-slate-500 font-medium text-center">
                PDF, DOC, DOCX, XLSX, PPT, TXT files
              </p>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-900">Category</p>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearSelection();
              setCategoryId("");
              onOpenChange(false);
            }}
            className="w-full sm:flex-1 h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 text-[16px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-[16px]"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        </div>
      </form>
    </DashboardModal>
  );
}