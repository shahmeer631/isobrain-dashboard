"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import {
  Document,
  DocumentCategoryObj,
} from "@/types/document";
import { toast } from "sonner";
import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { useUpdateDocumentMutation } from "@/lib/redux/features/document/documentApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";

const editSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "DRAFT", "Active", "Draft"]),
  type: z.enum(["PDF", "DOC", "DOCX", "XLSX", "PPTX", "TXT"]),
  fileSize: z.string().optional(),
});

type EditValues = z.infer<typeof editSchema>;

interface EditDocumentModalProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: Document) => void;
}

export function EditDocumentModal({
  document,
  open,
  onOpenChange,
  onEdit,
}: EditDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadFile] = useUploadFileMutation();
  const [updateDocument, { isLoading: isUpdating }] = useUpdateDocumentMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      category: "Templates",
      status: "Active",
      type: "PDF",
      fileSize: "1.2 MB",
    },
  });

  useEffect(() => {
    if (document && open && file === null) {
      let catId = "";
      if (document.categoryId) {
        catId = document.categoryId;
      } else if (typeof document.category === 'object' && document.category !== null) {
         catId = (document.category as DocumentCategoryObj).id;
      } else if (typeof document.category === 'string') {
         catId = document.category;
      }

      form.reset({
        title: document.title,
        category: catId,
        status: document.status as "ACTIVE" | "DRAFT" | "Active" | "Draft",
        type: document.type as "PDF" | "DOCX" | "XLSX" | "PPTX" | "TXT",
        fileSize: document.fileSize,
      });
    }
  }, [document, open, form, file]);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onSubmit = async (values: EditValues) => {
    if (!document) return;

    let fileUrl = document.fileUrl;
    let fileSizeStr = values.fileSize || "1.2 MB";

    try {
      if (file) {
        fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        const formData = new FormData();
        formData.append("file", file);

        try {
          const uploadRes = await uploadFile(formData).unwrap();
          if (uploadRes.success && uploadRes.data?.url) {
            fileUrl = uploadRes.data.url;
          }
        } catch (uploadObj: unknown) {
          console.error("Upload failed, formatting fallback URL", uploadObj);
        }
      }

      const payload = {
        title: values.title,
        categoryId: values.category,
        type: values.type,
        fileUrl: fileUrl,
        fileSize: fileSizeStr,
        status: values.status,
        description: document.description || "",
        version: document.version || "1.0",
        author: document.author || "",
        tags: document.tags || "",
      };

      const res = await updateDocument({ id: document.id, body: payload }).unwrap();
      if (res.success) {
        toast.success(res.message || "Document updated successfully");
        onEdit(res.data);
        form.reset();
        setFile(null);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Failed to update document");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(error);
      toast.error(error?.data?.message || "Failed to update document");
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Document"
      maxWidth="sm:max-w-[650px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Document Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Quality Manual Template"
                      {...field}
                      className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-indigo-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
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
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Document Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="DOC">DOC</SelectItem>
                        <SelectItem value="DOCX">DOCX</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                        <SelectItem value="PPTX">PPTX</SelectItem>
                        <SelectItem value="TXT">TXT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      File Size
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2.5 MB"
                        {...field}
                        className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-indigo-100"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Read-only Stats Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
                  Total Downloads
                </p>
                <p className="text-[16px] font-bold text-slate-900">
                  {document?.downloads || "0"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
                  File Type
                </p>
                <p className="text-[16px] font-bold text-slate-900 uppercase">
                  {document?.type || "PDF"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel className="text-sm font-bold text-slate-900">
                Replace File (Optional)
              </FormLabel>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors" />
                <p className="text-sm font-bold text-slate-500">
                  {file?.name || "Upload new version"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setFile(null);
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
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
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
