"use client";

import React, { useState } from "react";
import { DashboardModal } from "../../DashboardModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { ICoupon, ICreateCouponRequest } from "@/types/couponTypes";

interface CouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: ICoupon | null;
  onSubmit: (data: ICreateCouponRequest | Partial<ICoupon>) => void;
  isLoading?: boolean;
}

export function CouponModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading,
}: CouponModalProps) {
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    discountType: initialData?.discountType || "PERCENTAGE",
    discountValue: initialData?.discountValue?.toString() || "",
    usageLimit: initialData?.usageLimit?.toString() || "",
    expiryDate: initialData?.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      usageLimit: Number(formData.usageLimit),
    };

    onSubmit(submissionData);
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Create New Coupon" : "Edit Coupon"}
      maxWidth="sm:max-w-[600px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full space-y-2">
            <Label htmlFor="code" className="text-sm font-bold text-slate-700">
              Coupon Code *
            </Label>
            <Input
              id="code"
              placeholder="E.G., SUMMER2024"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="h-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white transition-all font-bold placeholder:font-normal"
              required
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Use uppercase letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-bold text-slate-700">
              Discount Type *
            </Label>
            <Select
              value={formData.discountType}
              onValueChange={(val: "PERCENTAGE" | "FIXED") =>
                setFormData({ ...formData, discountType: val })
              }
            >
              <SelectTrigger
                id="type"
                className="h-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-sm font-bold text-slate-700">
              Discount Value *
            </Label>
            <Input
              id="value"
              type="number"
              placeholder={
                formData.discountType === "PERCENTAGE" ? "e.g., 25" : "e.g., 50"
              }
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({ ...formData, discountValue: e.target.value })
              }
              className="h-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit" className="text-sm font-bold text-slate-700">
              Usage Limit
            </Label>
            <Input
              id="limit"
              type="number"
              placeholder="e.g., 100"
              value={formData.usageLimit}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value })
              }
              className="h-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="expiry"
              className="text-sm font-bold text-slate-700"
            >
              Expiry Date
            </Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className="h-11 bg-slate-50 border-slate-100 rounded-xl focus:bg-white"
              required
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12"
            variant={"primary"}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : mode === "create"
                ? "Create Coupon"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </DashboardModal>
  );
}
