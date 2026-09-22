"use client";

import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ISOStandard } from "@/types/iso-standards";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { useCreateISOStandardMutation } from "@/lib/redux/features/iso-standards/isoStandardApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  file: z.any().refine((file) => file instanceof File, "File is required"),
});

type UploadValues = z.infer<typeof uploadSchema>;

interface UploadStandardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (standard: ISOStandard) => void;
}

export function UploadStandardModal({
  open,
  onOpenChange,
  onUpload,
}: UploadStandardModalProps) {
  const [createISOStandard, { isLoading: isCreating }] = useCreateISOStandardMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      categoryId: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: UploadValues) => {
    try {
      // 1. Upload the file first
      const formData = new FormData();
      formData.append("file", data.file);
      
      const uploadResponse = await uploadFile(formData).unwrap();
      
      if (!uploadResponse?.success) {
        throw new Error(uploadResponse?.message || "File upload failed");
      }

      // 2. Create the ISO Standard with the file URL
      const payload = {
        title: data.title,
        categoryId: data.categoryId,
        fileUrl: uploadResponse.data.url,
        fileSize: parseFloat((data.file.size / (1024 * 1024)).toFixed(2)), // Size in MB
        status: "ACTIVE" as const,
      };

      const response = await createISOStandard(payload).unwrap();

      if (response?.success) {
        onUpload(response.data);
        form.reset();
        setFileName(null);
        onOpenChange(false);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to upload standard");
    }
  };

  const categories = categoriesData?.data || [];
  const isPending = isCreating || isUploading;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload ISO Standard"
      maxWidth="sm:max-w-[550px]"
    >
      <div
        onClick={() => !fileName && fileInputRef.current?.click()}
        className={cn(
          "group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer mb-6",
          fileName
            ? "border-indigo-200 bg-indigo-50/30 dark:bg-indigo-900/10"
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        )}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        {fileName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[300px]">
              {fileName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                form.resetField("file");
              }}
              className="text-slate-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-[13px] text-slate-500 font-medium">
              PDF files up to 10MB
            </p>
          </>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Quality Management Systems"
                    className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]">
                      <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 h-12 rounded-xl text-slate-600 font-bold border-slate-200 dark:border-slate-800"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-12"
              variant="primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                "Upload Standard"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
