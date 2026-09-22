"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
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
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICourse } from "@/types/courseTypes";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import {
  useUpdateCourseMutation,
  useGetSingleCourseQuery,
} from "@/lib/redux/features/course/courseApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useUploadFileMutation } from "@/lib/redux/features/upload/uploadApi";
import { Error } from "@/types/shared";

const editCourseSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  cpd: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional(),
});

type EditCourseValues = z.infer<typeof editCourseSchema>;

interface EditCourseModalProps {
  courseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (course: ICourse) => void;
}

export function EditCourseModal({
  courseId,
  open,
  onOpenChange,
  onEdit,
}: EditCourseModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courseData, isLoading: isFetching } = useGetSingleCourseQuery(
    courseId as string,
    { skip: !courseId || !open }
  );

  const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const form = useForm<EditCourseValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      title: "",
      instructor: "",
      description: "",
      category: "",
      cpd: "",
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (courseData?.data) {
      const course = courseData.data;
      form.reset({
        title: course.title,
        instructor: course.instructor,
        description: course.description || "",
        category: course.categoryId || "",
        cpd: course.cpdHours?.toString() || "",
        status: course.status,
      });
      setPreviewImage(course.thumbnail || null);
      setSelectedFile(null);
    }
  }, [courseData?.data, form, open]);

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

  const onSubmit = async (data: EditCourseValues) => {
    if (!courseId) return;

    try {
      const currentCourse = courseData?.data;
      let thumbnailUrl = currentCourse?.thumbnail || "";

      // 1. Try to upload image if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const uploadResponse = await uploadImage(formData).unwrap();
          if (uploadResponse.success && uploadResponse?.data?.url) {
            thumbnailUrl = uploadResponse.data.url;
          } else {
            toast.error(uploadResponse.message || "Image upload failed. Cannot update course.");
            return; // stop execution
          }
        } catch (err: unknown) {
          const error = err as Error & { data?: { message?: string } };
          console.error("Image upload failed:", error);
          toast.error(error?.data?.message || error?.message || "Image upload failed. Cannot update course.");
          return; // stop execution
        }
      } else if (!previewImage && !selectedFile) {
        // user removed the image
        thumbnailUrl = "";
      }

      // 2. Update the course
      const coursePayload = {
        title: data.title?.trim() || currentCourse?.title || "",
        instructor: data.instructor?.trim() || currentCourse?.instructor || "",
        description: data.description ?? currentCourse?.description ?? "",
        categoryId: data.category || currentCourse?.categoryId || "",
        cpdHours: Number(data.cpd ?? currentCourse?.cpdHours?.toString() ?? 0) || 0,
        thumbnail: thumbnailUrl || "",
        status: (data.status ?? currentCourse?.status ?? "DRAFT") as ICourse["status"],
      };

      const response = await updateCourse({ id: courseId, body: coursePayload }).unwrap();

      if (response.success) {
        toast.success(response.message || "Course updated successfully");
        onOpenChange(false);
        if (response.data) {
          onEdit(response.data);
        }
      } else {
        toast.error(response.message || "Failed to update course");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Course update error:", error);
      toast.error(error?.message || "An error occurred while updating the course");
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Course"
      maxWidth="sm:max-w-[600px]"
    >
      {isFetching ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({
                field,
              }: {
                field: ControllerRenderProps<EditCourseValues, "title">;
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Course Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ISO 9001:2015 Complete Guide"
                      className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
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
                name="instructor"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<EditCourseValues, "instructor">;
                }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Instructor
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
                name="status"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<EditCourseValues, "status">;
                }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({
                field,
              }: {
                field: ControllerRenderProps<EditCourseValues, "description">;
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
                  field: ControllerRenderProps<EditCourseValues, "category">;
                }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
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
                  field: ControllerRenderProps<EditCourseValues, "cpd">;
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
                disabled={isUploading || isUpdating}
              >
                {isUploading
                  ? "Uploading..."
                  : isUpdating
                    ? "Updating..."
                    : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </DashboardModal>
  );
}
