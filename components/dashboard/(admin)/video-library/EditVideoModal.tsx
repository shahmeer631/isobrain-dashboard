"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Upload, Loader2 } from "lucide-react";
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
import { IVideo } from "@/types/videoTypes";
import { useUpdateVideoMutation } from "@/lib/redux/features/video/videoApi";
import { useGetCoursesQuery } from "@/lib/redux/features/course/courseApi";
import { toast } from "sonner";

const editVideoSchema = z.object({
  title: z.string().min(1, "Video title is required"),
  courseId: z.string().min(1, "Course is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
  thumbnail: z.string().optional().nullable(),
});

type EditVideoFormValues = z.infer<typeof editVideoSchema>;

interface EditVideoModalProps {
  video: IVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function EditVideoModal({
  video,
  open,
  onOpenChange,
  onEdit,
}: EditVideoModalProps) {
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();
  const { uploadFile, isUploading } = useFileUpload();
  const { data: coursesData, isLoading: isCoursesLoading } = useGetCoursesQuery();
  const courses = coursesData?.data || [];

  const [selectedVideoConfig, setSelectedVideoConfig] = React.useState<{
    file: File;
    preview: string;
  } | null>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedThumbConfig, setSelectedThumbConfig] = React.useState<{
    file: File;
    preview: string;
  } | null>(null);
  const thumbInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<EditVideoFormValues>({
    resolver: zodResolver(editVideoSchema),
    defaultValues: {
      title: "",
      courseId: "",
      status: "PUBLISHED",
      duration: "",
      description: "",
      videoUrl: "",
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (video && open) {
      const courseId = video.lessons?.[0]?.courseId || "";
      form.reset({
        title: video.title || "",
        courseId: courseId,
        status: (video.status as EditVideoFormValues["status"]) || "PUBLISHED",
        duration: video.duration || "",
        description: video.description || "",
        videoUrl: video.videoUrl || "",
        thumbnail: video.thumbnail || "",
      });
    }
  }, [video, open, form]);

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

  const onSubmit = async (values: EditVideoFormValues) => {
    if (!video) return;

    let finalVideoUrl = values.videoUrl;
    let finalThumbUrl = values.thumbnail || null;

    // Handle new uploads
    if (selectedVideoConfig?.file) {
      const url = await uploadFile(selectedVideoConfig.file);
      if (url) finalVideoUrl = url;
      else return;
    }

    if (selectedThumbConfig?.file) {
      const url = await uploadFile(selectedThumbConfig.file);
      if (url) finalThumbUrl = url;
      else return;
    }

    try {
      const response = await updateVideo({
        id: video.id,
        body: {
          title: values.title,
          courseId: values.courseId,
          description: values.description || "",
          status: values.status,
          duration: values.duration,
          videoUrl: finalVideoUrl,
          thumbnail: finalThumbUrl,
        },
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Video updated successfully");
        onEdit(); // Tell parent we're done
        onOpenChange(false);
      } else {
        toast.error(response.message || "Failed to update video");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "An error occurred while updating the video");
    }
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Video"
      maxWidth="sm:max-w-[650px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={videoInputRef}
            onChange={handleVideoSelect}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={thumbInputRef}
            onChange={handleThumbSelect}
          />

          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <FormLabel className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Video Content
              </FormLabel>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border border-slate-100 group">
                <video
                  src={selectedVideoConfig?.preview || video?.videoUrl || ""}
                  className="w-full h-full object-contain"
                  controls={!!(selectedVideoConfig?.preview || video?.videoUrl)}
                  poster={selectedThumbConfig?.preview || video?.thumbnail || ""}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-900 shadow-2xl">
                    <Upload className="w-4 h-4" />
                    Click &quot;update&quot; to change
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl border-slate-200 font-bold text-xs"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
              >
                {selectedVideoConfig ? "Change Selection" : "Update Video File"}
              </Button>
            </div>

            <div className="space-y-3">
              <FormLabel className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Thumbnail Image
              </FormLabel>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-50 shadow-inner border border-slate-100 group flex items-center justify-center">
                {(selectedThumbConfig?.preview || video?.thumbnail) ? (
                  <img
                    src={selectedThumbConfig?.preview || video?.thumbnail || ""}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 opacity-20" />
                    <span className="text-[10px] font-black uppercase">No Media</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-900 shadow-2xl">
                    <Upload className="w-4 h-4" />
                    Click &quot;update&quot; to change
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl border-slate-200 font-bold text-xs"
                onClick={() => thumbInputRef.current?.click()}
                disabled={isUploading}
              >
                {selectedThumbConfig ? "Change Selection" : "Update Thumbnail"}
              </Button>
            </div>
          </div>

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
                      className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-1 focus:ring-indigo-100"
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
                      Course *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                          <SelectItem value="none" disabled>No courses available</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      className="bg-slate-50 border-none min-h-[90px] rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0 resize-none font-medium placeholder:text-slate-400 text-[15px] transition-colors focus:bg-white focus:ring-indigo-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Read Only Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
                  Views
                </p>
                <p className="text-[16px] font-bold text-slate-900">
                  {video?.views || "0"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
                  Uploaded
                </p>
                <p className="text-[16px] font-bold text-slate-900">
                  {video ? new Date(video.createdAt).toLocaleDateString() : "Just now"}
                </p>
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
              disabled={isUpdating || isUploading}
            >
              {isUpdating || isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
