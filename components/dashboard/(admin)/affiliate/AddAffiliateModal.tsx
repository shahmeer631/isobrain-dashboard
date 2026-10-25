"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { IAffiliate, ICreateAffiliateRequest, IUpdateAffiliateRequest } from "@/types/affiliateTypes";
import { useCreateAffiliateMutation, useUpdateAffiliateMutation } from "@/lib/redux/features/affiliate/affiliateApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const affiliateSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  affiliateCode: z.string().min(1, "Affiliate Code is required"),
  commissionRate: z.string().min(1, "Commission Rate is required"),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  paymentDetails: z.string().min(1, "Payment Details are required"),
  notes: z.string().optional(),
});

type AffiliateFormValues = z.infer<typeof affiliateSchema>;

interface AddAffiliateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: IAffiliate | null;
}

export function AddAffiliateModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: AddAffiliateModalProps) {
  const [createAffiliate, { isLoading: isCreating }] = useCreateAffiliateMutation();
  const [updateAffiliate, { isLoading: isUpdating }] = useUpdateAffiliateMutation();

  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      name: "",
      email: "",
      affiliateCode: "",
      commissionRate: "10",
      status: "ACTIVE",
      paymentMethod: "Stripe",
      paymentDetails: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        form.reset({
          name: initialData.name,
          email: initialData.email,
          affiliateCode: initialData.affiliateCode,
          commissionRate: initialData.commissionRate.toString(),
          status: initialData.status,
          paymentMethod: initialData.paymentMethod,
          paymentDetails: initialData.paymentDetails,
          notes: initialData.notes || "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          affiliateCode: "",
          commissionRate: "10",
          status: "ACTIVE",
          paymentMethod: "Stripe",
          paymentDetails: "",
          notes: "",
        });
      }
    }
  }, [open, mode, initialData, form]);

  async function onSubmit(values: AffiliateFormValues) {
    const payload = {
      ...values,
      commissionRate: Number(values.commissionRate),
    };

    try {
      if (mode === "create") {
        await createAffiliate(payload as ICreateAffiliateRequest).unwrap();
        toast.success("Affiliate created successfully");
      } else if (initialData) {
        await updateAffiliate({ id: initialData.id, body: payload as IUpdateAffiliateRequest }).unwrap();
        toast.success("Affiliate updated successfully");
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
      title={mode === "create" ? "Add New Affiliate" : "Edit Affiliate"}
      maxWidth="sm:max-w-[550px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Full Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Sarah Martinez"
                    {...field}
                    className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20 placeholder:text-[var(--ib-mute)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., sarah@example.com"
                    {...field}
                    className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20 placeholder:text-[var(--ib-mute)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliateCode"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Affiliate Code *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., SARAH2024"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20 placeholder:text-[var(--ib-mute)]"
                  />
                </FormControl>
                <FormDescription className="text-xs text-[var(--ib-mute)]">
                  Unique code for tracking sales
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Commission Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus:ring-1 focus:ring-[var(--ib-acc)]/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Payment Method
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus:ring-1 focus:ring-[var(--ib-acc)]/20">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-[var(--ib-line)] shadow-xl">
                    <SelectItem value="Stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentDetails"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Payment Details
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="stripe email or bank account"
                    {...field}
                    className="bg-[var(--ib-bg)] border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20 placeholder:text-[var(--ib-mute)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-[var(--ib-ink)]">
                  Notes (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information..."
                    {...field}
                    className="bg-[var(--ib-bg)] border-none min-h-[100px] rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ib-acc)]/20 resize-none placeholder:text-[var(--ib-mute)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 h-12 rounded-xl border-[var(--ib-line)] font-bold hover:bg-[var(--ib-bg)] text-[var(--ib-mute)]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-12 rounded-xl font-bold"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : mode === "create" ? (
                "Add Affiliate"
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
