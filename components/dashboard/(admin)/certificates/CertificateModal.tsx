"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICertificateTemplate, ICreateCertificateRequest } from "@/types/certificateTypes";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { useGetCourseswithoutPaginationQuery } from "@/lib/redux/features/course/courseApi";
import { useGetAllUsersQuery } from "@/lib/redux/features/user/userApi";
import { useIssueCertificateMutation } from "@/lib/redux/features/certificates/certificateApi";
import { useFileUpload } from "@/hooks/useFileUpload";

const createCertificateSchema = z.object({
  name: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  userId: z.string().optional(),
});

type CreateCertificateValues = z.infer<typeof createCertificateSchema>;

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cert: Partial<ICreateCertificateRequest>) => void;
  editingCertificate: ICertificateTemplate | null;
  mode: "edit" | "design" | "create";
  isLoading?: boolean;
}

export function CertificateModal({
  open,
  onOpenChange,
  onSave,
  editingCertificate,
  mode,
  isLoading: isMutationLoading,
}: CertificateModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useFileUpload();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourseswithoutPaginationQuery();
  const courses = coursesData?.data || [];
  
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const users = usersData?.data || [];
  const [issueCertificate, { isLoading: isIssuing }] = useIssueCertificateMutation();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const form = useForm<CreateCertificateValues>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      name: "",
      courseId: "",
    },
  });

  useEffect(() => {
    if (editingCertificate) {
      form.reset({
        name: editingCertificate.name || "",
        courseId: editingCertificate.courses?.[0]?.id || "",
        userId: "",
      });
      setUserSearchTerm("");
      if (editingCertificate.backgroundImageUrl) {
        setPreviewImage(editingCertificate.backgroundImageUrl);
      } else {
        setPreviewImage(null);
      }
      setSelectedFile(null);
    } else {
      form.reset({
        name: "",
        courseId: "",
      });
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [editingCertificate, form, open]);

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

  const onSubmit = async (data: CreateCertificateValues) => {
    try {
      if (mode === "design") {
        if (!data.userId) {
          toast.error("Please select a user to assign the certificate");
          return;
        }
        if (!editingCertificate) return;
        
        const payload = {
          userId: data.userId,
          courseId: data.courseId,
          templateId: editingCertificate.id,
        };
        
        const res = await issueCertificate(payload).unwrap();
        if (res.success) {
          toast.success(res.message || "Certificate assigned successfully");
          onOpenChange(false);
        }
        return;
      }

      let backgroundImageUrl = previewImage || "";

      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (uploadedUrl) {
          backgroundImageUrl = uploadedUrl;
        } else {
          return; // Stop if upload failed
        }
      }

      const payload: Partial<ICreateCertificateRequest> = {
        name: data.name || "",
        courseIds: [data.courseId],
        autoIssue: true,
        backgroundImageUrl: backgroundImageUrl,
      };

      await onSave(payload);
    } catch (err: any) {
      console.error("Failed to save certificate template", err);
      toast.error(err?.data?.message || "Failed to process request");
    }
  };

  const filteredUsers = users.filter((u: any) => 
    u.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "edit"
          ? "Edit Certificate"
          : mode === "design"
          ? "Assign Certificate"
          : "Create Certificate"
      }
      maxWidth="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {mode === "design" ? (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-semibold">
                    Search User by Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Type email to search..."
                        value={userSearchTerm}
                        onChange={(e) => {
                          setUserSearchTerm(e.target.value);
                          setShowUserDropdown(true);
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 border-slate-100 dark:border-slate-800 transition-all duration-200"
                      />
                      {showUserDropdown && userSearchTerm && (
                        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {isLoadingUsers ? (
                            <div className="p-3 text-sm text-slate-500 text-center">Loading...</div>
                          ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((u: any) => (
                              <div
                                key={u.id}
                                className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-300"
                                onClick={() => {
                                  field.onChange(u.id);
                                  setUserSearchTerm(u.email);
                                  setShowUserDropdown(false);
                                }}
                              >
                                {u.email}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-sm text-slate-500 text-center">No users found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="name"
              render={({
                field,
              }: {
                field: ControllerRenderProps<CreateCertificateValues, "name">;
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Certificate Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Standard Completion"
                      className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 border-slate-100 dark:border-slate-800 transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="courseId"
            render={({
              field,
            }: {
              field: ControllerRenderProps<CreateCertificateValues, "courseId">;
            }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Course <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={mode === "design"}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 [&>span]:truncate [&>span]:block [&>span]:text-left">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60">
                    {isLoadingCourses ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      </div>
                    ) : courses.length > 0 ? (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 text-center text-sm text-slate-500">No courses found</div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-sm font-semibold mb-2 block">
              Certificate Thumbnail
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
                "border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden relative group",
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

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-12 rounded-xl font-bold text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isMutationLoading || isUploading || isIssuing}
              className="w-full sm:flex-[1.5] h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[16px] shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {(isMutationLoading || isUploading || isIssuing) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : null}
              {isUploading ? "Uploading..." : isIssuing ? "Assigning..." : isMutationLoading ? "Saving..." : mode === "design" ? "Assign Certificate" : "Create Certificate"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}

