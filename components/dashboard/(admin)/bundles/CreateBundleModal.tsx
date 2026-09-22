"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { IBundle } from "@/types/bundles";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { useCreateBundleMutation } from "@/lib/redux/features/course/bundleApi";
import { toast } from "sonner";
import { Error } from "@/types/shared";

const bundleSchema = z.object({
  title: z.string().min(1, "Bundle Title is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Bundle Price is required"),
  originalPrice: z.string().optional(),
  selectedItems: z.array(z.string()).min(1, "Select at least one item"),
});

type BundleFormValues = z.infer<typeof bundleSchema>;

interface CreateBundleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (bundle: IBundle) => void;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
}

export function CreateBundleModal({
  open,
  onOpenChange,
  onCreate,
}: CreateBundleModalProps) {
  const [createBundle, { isLoading: isCreating }] = useCreateBundleMutation();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (open) {
      fetch("https://api.isobrain.ai/api/v1/courses/all", {
        method: "GET",
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success && Array.isArray(result.data)) {
            setCourses(result.data);
          }
        })
        .catch((error) => console.error("Error fetching courses:", error));
    }
  }, [open]);

  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "299",
      originalPrice: "450",
      selectedItems: [],
    },
  });

  const toggleItem = (itemId: string) => {
    const currentItems = form.getValues("selectedItems");
    const updatedItems = currentItems.includes(itemId)
      ? currentItems.filter((i) => i !== itemId)
      : [...currentItems, itemId];
    form.setValue("selectedItems", updatedItems, { shouldValidate: true });
    console.log("Selected Array of IDs:", updatedItems);
  };

  const onSubmit = React.useCallback(
    async (values: BundleFormValues) => {
      try {
        const payload = {
          title: values.title,
          description: values.description || "",
          price: Number(values.price),
          originalPrice: values.originalPrice ? Number(values.originalPrice) : 0,
          courseIds: values.selectedItems,
        };

        const response = await createBundle(payload).unwrap();

        if (response.success) {
          toast.success(response.message || "Bundle created successfully");
          form.reset();
          onOpenChange(false);
          if (response.data) {
            onCreate(response.data);
          }
        } else {
          toast.error(response.message || "Failed to create bundle");
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Bundle creation error:", error);
        toast.error(error?.message || "An error occurred while creating the bundle");
      }
    },
    [createBundle, form, onOpenChange, onCreate],
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Bundle"
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
                    Bundle Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Quality Management Suite"
                      {...field}
                      className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors focus:bg-white focus:ring-1 focus:ring-purple-100"
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
                      placeholder="Brief description of the bundle..."
                      {...field}
                      className="bg-slate-50 border-none min-h-[100px] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 resize-none transition-colors focus:bg-white focus:ring-1 focus:ring-purple-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Bundle Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors focus:bg-white focus:ring-1 focus:ring-purple-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Original Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors focus:bg-white focus:ring-1 focus:ring-purple-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="selectedItems"
              render={({ field }) => {
                const selectedCourses = field.value
                  .map((id) => courses.find((c) => c.id === id))
                  .filter(Boolean) as Course[];
                const filteredCourses = courses.filter((course) =>
                  course.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Select Items to Include *
                    </FormLabel>
                    
                    {selectedCourses.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Selected Items:</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedCourses.map((course, index) => (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => toggleItem(course.id)}
                              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:border-red-200 hover:bg-red-50 transition-all"
                            >
                              <div className="relative w-4 h-4 flex items-center justify-center">
                                {index === 0 ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400 group-hover:opacity-0 transition-opacity absolute"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400 group-hover:opacity-0 transition-opacity absolute"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                                )}
                                <X className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                              </div>
                              <span className="group-hover:text-red-700 transition-colors">{course.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-2 bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors focus:bg-white focus:ring-1 focus:ring-purple-100 placeholder:text-slate-400"
                    />
                    
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                      <ScrollArea className="h-[200px] w-full">
                        <div className="p-1">
                          {filteredCourses.map((course) => (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => toggleItem(course.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 text-left",
                                field.value.includes(course.id)
                                  ? "text-slate-900 bg-purple-50/30"
                                  : "text-slate-500"
                              )}
                            >
                              {course.title}
                              {field.value.includes(course.id) && (
                                <Check className="w-4 h-4 text-purple-600" />
                              )}
                            </button>
                          ))}
                          {filteredCourses.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-500">
                              No courses found.
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-12 rounded-xl font-bold"
              variant="primary"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Bundle"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
