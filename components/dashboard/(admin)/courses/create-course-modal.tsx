"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { z } from "zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICourse } from "@/types/courseTypes";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import {
  useCreateCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Error } from "@/types/shared";
import { Loader2 } from "lucide-react";

const createCourseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  instructor: z.string().min(1, "Instructor name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  cpd: z.string().optional(),
});

type CreateCourseValues = z.infer<typeof createCourseSchema>;

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (course: ICourse) => void;
}

export function CreateCourseModal({
  open,
  onOpenChange,
  onCreate,
}: CreateCourseModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useFileUpload();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      instructor: "",
      description: "",
      category: "",
      cpd: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = React.useCallback(
    async (data: CreateCourseValues) => {
      try {
        let thumbnailUrl =
          "https://isobrain-space.nyc3.digitaloceanspaces.com/course-thumbnails/iso9001.jpg"; // Default fallback

        // 1. Try to upload image if a file is selected
        const file = selectedFile;
        if (file) {
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            thumbnailUrl = uploadedUrl;
          } else {
            // Stop creation flow if upload failed, so we don't proceed with base64
            // and the user has already seen the toast from useFileUpload
            return;
          }
        }

        // 2. Create the course
        const coursePayload = {
          title: data.title,
          instructor: data.instructor,
          description: data.description || "",
          categoryId: data.category,
          cpdHours: Number(data.cpd) || 0,
          thumbnail: thumbnailUrl,
        };

        const response = await createCourse(coursePayload).unwrap();

        if (response.success) {
          toast.success(response.message || "Course created successfully");
          form.reset();
          setPreviewImage(null);
          onOpenChange(false);
          if (response.data) {
            onCreate(response.data);
          }
        } else {
          toast.error(response.message || "Failed to create course");
        }
      } catch (err: unknown) {  
        const error = err as Error;
        console.error("Course creation error:", error);
        toast.error(
          error?.message ||
            "==================== An error occurred while creating the course",
        );
      }
    },
    [uploadFile, createCourse, form, onOpenChange, onCreate, selectedFile],
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Course"
      maxWidth="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({
              field,
            }: {
              field: ControllerRenderProps<CreateCourseValues, "title">;
            }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Course Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., ISO 9001:2015 Complete Guide"
                    className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 border-slate-100 dark:border-slate-800 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor"
            render={({
              field,
            }: {
              field: ControllerRenderProps<CreateCourseValues, "instructor">;
            }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Instructor <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instructor name"
                    className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<CreateCourseValues, "description">;
            }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Course description..."
                    className="h-32 resize-none rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
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
              name="category"
              render={({
                field,
              }: {
                field: ControllerRenderProps<CreateCourseValues, "category">;
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {isCategoriesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpd"
              render={({
                field,
              }: {
                field: ControllerRenderProps<CreateCourseValues, "cpd">;
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    CPD Hours
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 12"
                      className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-sm font-semibold">
              Course Thumbnail
            </FormLabel>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div
              onClick={() => !previewImage && fileInputRef.current?.click()}
              className={cn(
                "mt-2 border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden relative group",
                previewImage
                  ? "border-indigo-200 bg-slate-50 dark:bg-slate-800/20 p-2"
                  : "border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-300",
              )}
            >
              {previewImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="h-8 bg-white/90 hover:bg-white text-slate-900 border-none"
                    >
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="h-8"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-full mb-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG or WebP (max. 800x400px)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 rounded-xl h-11"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-11"
              variant="primary"
              disabled={isUploading || isCreating}
            >
              {isUploading
                ? "Uploading..."
                : isCreating
                  ? "Creating..."
                  : "Create Course"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
