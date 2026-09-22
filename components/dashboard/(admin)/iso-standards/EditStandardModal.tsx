"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { useUpdateISOStandardMutation } from "@/lib/redux/features/iso-standards/isoStandardApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  file: z.any().optional(),
});

type EditValues = z.infer<typeof editSchema>;

interface EditStandardModalProps {
  standard: ISOStandard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (standard: ISOStandard) => void;
}

export function EditStandardModal({
  standard,
  open,
  onOpenChange,
  onEdit,
}: EditStandardModalProps) {
  const [updateISOStandard, { isLoading: isUpdating }] = useUpdateISOStandardMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (standard && open) {
      form.reset({
        title: standard.title,
        categoryId: standard.categoryId,
        status: standard.status,
      });
      setFileName(null);
    }
  }, [standard, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: EditValues) => {
    if (!standard) return;
    
    try {
      let fileUrl = standard.fileUrl;
      let fileSize = standard.fileSize;

      // 1. If a new file is selected, upload it first
      if (data.file instanceof File) {
        const formData = new FormData();
        formData.append("file", data.file);
        
        const uploadResponse = await uploadFile(formData).unwrap();
        
        if (!uploadResponse?.success) {
          throw new Error(uploadResponse?.message || "File upload failed");
        }
        
        fileUrl = uploadResponse.data.url;
        fileSize = parseFloat((data.file.size / (1024 * 1024)).toFixed(2));
      }

      // 2. Update the ISO Standard with the potentially new file URL and other fields as JSON
      const payload: Partial<ISOStandard> = {
        title: data.title,
        categoryId: data.categoryId,
        status: data.status,
        fileUrl,
        fileSize,
      };

      const response = await updateISOStandard({
        id: standard.id,
        body: payload
      }).unwrap();

      if (response?.success) {
        onEdit(response.data);
        onOpenChange(false);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to update standard");
    }
  };

  const categories = categoriesData?.data || [];
  const isPending = isUpdating || isUploading;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit ISO Standard"
      maxWidth="sm:max-w-[550px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer mb-6",
              fileName
                ? "border-indigo-200 bg-indigo-50/30 dark:bg-indigo-900/10"
                : "border-slate-100 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
            )}
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <UploadCloud className={cn("w-6 h-6 mb-2 text-slate-400 group-hover:text-indigo-600 transition-colors", fileName && "text-indigo-600")} />
            {fileName ? (
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {fileName}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 text-center">
                Click to update PDF document (optional)
              </span>
            )}
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[14px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
