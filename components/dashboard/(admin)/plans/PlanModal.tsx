"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IPlan,
  ICreatePlanRequest,
  IUpdatePlanRequest,
} from "@/types/planTypes";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/lib/redux/features/plans/plansApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Error } from "@/types/shared";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  badge: z.string().nullable(),
  buttonText: z.string().min(1, "Button text is required"),
  originalPrice: z.coerce.number().min(0, "Price must be >= 0"),
  discountedPrice: z.coerce.number().min(0, "Price must be >= 0"),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
  learningUnits: z.coerce.number().min(1, "Must be at least 1 unit"),
  validityDays: z.coerce.number().min(1, "Must be at least 1 day"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  isActive: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: IPlan | null;
}

const AVAILABLE_FEATURES = [
  "Library Access",
  "ISO Mastery Lab",
  "AI Assistant",
  "Academy",
  "Priority Support",
];

export function PlanModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: PlanModalProps) {
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      badge: "none",
      buttonText: "Get Started",
      originalPrice: 0,
      discountedPrice: 0,
      validFrom: "",
      validUntil: "",
      learningUnits: 0,
      validityDays: 30,
      features: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        form.reset({
          name: initialData.name,
          description: initialData.description || "",
          badge: initialData.badge,
          buttonText: initialData.buttonText || "Get Started",
          originalPrice: initialData.originalPrice,
          discountedPrice: initialData.discountedPrice,
          validFrom: initialData.validFrom
            ? initialData.validFrom.split("T")[0]
            : "",
          validUntil: initialData.validUntil
            ? initialData.validUntil.split("T")[0]
            : "",
          learningUnits: initialData.learningUnits,
          validityDays: initialData.validityDays,
          features: initialData.features || [],
          isActive: initialData.isActive,
        });
      } else {
        form.reset({
          name: "",
          description: "Perfect for getting started with ISO learning",
          badge: null,
          buttonText: "Get Started Free",
          originalPrice: 45,
          discountedPrice: 20,
          validFrom: new Date().toISOString().split("T")[0],
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          learningUnits: 650,
          validityDays: 30,
          features: ["Library Access"],
          isActive: true,
        });
      }
    }
  }, [open, mode, initialData, form]);

  async function onSubmit(values: PlanFormValues) {
    try {
      if (mode === "create") {
        await createPlan(values as ICreatePlanRequest).unwrap();
        toast.success("Plan created successfully");
      } else if (initialData) {
        await updatePlan({
          id: initialData.id,
          body: values as IUpdatePlanRequest,
        }).unwrap();
        toast.success("Plan updated successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Something went wrong");
    }
  }

  const isLoading = isCreating || isUpdating;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add New Plan" : "Edit Plan"}
      maxWidth="sm:max-w-[850px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Plan Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Silver"
                        {...field}
                        className="bg-slate-50 border-none h-11 rounded-xl"
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Description *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Plan description..."
                        {...field}
                        className="bg-slate-50 border-none h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Price After Discount *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
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
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Original Price *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="learningUnits"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Learning Units *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validityDays"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Validity (Days) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] uppercase">
                        30d=1m, 60d=2m
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validFrom"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Valid From *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-bold text-slate-900">
                        Valid Until *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-slate-50 border-none h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Features *
                    </FormLabel>
                    <div className="grid grid-cols-1 gap-3">
                      {AVAILABLE_FEATURES.map((feature) => (
                        <FormField
                          key={feature}
                          control={form.control}
                          name="features"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            feature,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== feature,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                                  {feature}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Badge
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-none h-11 rounded-xl">
                          <SelectValue placeholder="Select badge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Most Popular">
                          Most Popular
                        </SelectItem>
                        <SelectItem value="Best Value">Best Value</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Button Text *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Get Started Free"
                        {...field}
                        className="bg-slate-50 border-none h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-slate-900">
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "true")}
                      defaultValue={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-none h-11 rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:flex-1 h-12 rounded-xl font-bold transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : mode === "create" ? (
                "Create Plan"
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
