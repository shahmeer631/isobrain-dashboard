"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateVideoMutation } from "@/lib/redux/features/video/videoApi";
import { useGetCoursesQuery, useGetCourseswithoutPaginationQuery } from "@/lib/redux/features/course/courseApi";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const videoSchema = z.object({
  title: z.string().min(1, "Video title is required"),
  courseId: z.string().min(1, "Course selection is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  description: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  thumbnail: z.string().optional(),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface UploadVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
}

export function UploadVideoModal({
  open,
  onOpenChange,
  onUpload,
}: UploadVideoModalProps) {
  const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation();
  const { uploadFile, isUploading } = useFileUpload();
  const { data: coursesData, isLoading: isCoursesLoading } = useGetCourseswithoutPaginationQuery();
  const courses = Array.isArray(coursesData?.data) ? coursesData.data : [];

  const [selectedVideoConfig, setSelectedVideoConfig] = React.useState<{
    file: File;
    preview: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedThumbConfig, setSelectedThumbConfig] = React.useState<{
    file: File;
    preview: string;
  } | null>(null);
  const thumbInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      courseId: "",
      status: "PUBLISHED",
      description: "",
      duration: "",
      thumbnail: "",
    },
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideoConfig({ file, preview: videoUrl });
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const thumbUrl = URL.createObjectURL(file);
      setSelectedThumbConfig({ file, preview: thumbUrl });
    }
  };

  const onSubmit = React.useCallback(
    async (values: VideoFormValues) => {
      let uploadedVideoUrl = "";
      let uploadedThumbUrl = "";

      if (selectedVideoConfig?.file) {
        const url = await uploadFile(selectedVideoConfig.file);
        if (url) {
          uploadedVideoUrl = url;
        } else {
          return; // Stop if upload failed
        }
      } else {
        toast.error("Please upload a video file");
        return;
      }

      if (selectedThumbConfig?.file) {
        const url = await uploadFile(selectedThumbConfig.file);
        if (url) {
          uploadedThumbUrl = url;
        } else {
          toast.error("Thumbnail upload failed.");
          return; // Stop if thumb upload failed
        }
      }

      try {
        const payload = {
          title: values.title,
          courseId: values.courseId,
          description: values.description || "",
          videoUrl: uploadedVideoUrl,
          thumbnail:
            uploadedThumbUrl ||
            "https://bucket.s3.amazonaws.com/images/thumb.png", // Use uploaded thumb or generic fallback
          duration: values.duration,
          status: values.status,
        };

        const response = await createVideo(payload).unwrap();

        if (response?.success) {
          toast.success(response.message || "Video created successfully");
          onUpload(); // Callback for success, doesn't need to pass the item since RTK Query handles refetch.
          form.reset();
          setSelectedVideoConfig(null);
          setSelectedThumbConfig(null);
          onOpenChange(false);
        } else {
          toast.error(response?.message || "Failed to create video");
        }
      } catch (err: unknown) {
        const rtkError = err as { data?: { message?: string }; message?: string };
        toast.error(
          rtkError?.data?.message || rtkError?.message || "An error occurred while creating the video",
        );
      }
    },
    [
      form,
      onUpload,
      onOpenChange,
      createVideo,
      uploadFile,
      selectedVideoConfig,
      selectedThumbConfig,
    ],
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Video"
      maxWidth="sm:max-w-[650px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Drag & Drop Area */}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleVideoSelect}
          />

          {!selectedVideoConfig ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-[17px] font-bold text-slate-900 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm font-semibold text-slate-400">
                MP4, AVI, MOV files up to 500MB
              </p>
            </div>
          ) : (
            <div className="relative border-2 border-slate-200 rounded-3xl overflow-hidden bg-black/5 flex items-center justify-center p-2 group">
              <video
                src={selectedVideoConfig.preview}
                className="w-full h-auto max-h-[250px] rounded-2xl object-cover"
                controls
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setSelectedVideoConfig(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Video Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ISO 9001 Introduction"
                      {...field}
                      className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-indigo-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Select Course *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {isCoursesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                          </div>
                        ) : courses.length > 0 ? (
                          courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No courses available
                          </SelectItem>
                        )}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-offset-0 text-slate-900 font-medium text-[15px] transition-colors focus:bg-white focus:ring-indigo-100">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-slate-900">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the video..."
                      {...field}
                      className="bg-slate-50 border-none min-h-[100px] rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 resize-none font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-indigo-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Duration (mm:ss)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 15:30"
                        {...field}
                        className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-1 focus:ring-indigo-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm font-bold text-slate-900 block mb-2">
                  Thumbnail
                </FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={thumbInputRef}
                  onChange={handleThumbSelect}
                />

                {!selectedThumbConfig ? (
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl h-12 flex items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <p className="text-[13px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                      Click to select thumbnail image
                    </p>
                  </div>
                ) : (
                  <div className="relative border-2 border-slate-200 rounded-xl overflow-hidden bg-black/5 flex items-center gap-3 p-2 group h-20">
                    <div className="relative h-full aspect-video rounded-lg overflow-hidden shrink-0 bg-white">
                      <img
                        src={selectedThumbConfig.preview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 truncate font-bold mb-1">
                        {selectedThumbConfig.file.name}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 h-auto text-[11px] font-bold"
                        onClick={() => {
                          setSelectedThumbConfig(null);
                          if (thumbInputRef.current)
                            thumbInputRef.current.value = "";
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 text-[16px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-14 rounded-2xl font-bold text-[16px]"
              variant="primary"
              disabled={isUploading || isCreating}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
