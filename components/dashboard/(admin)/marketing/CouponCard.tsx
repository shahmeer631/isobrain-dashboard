"use client";

import React from "react";
import { Copy, Edit, Trash2, Tag, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ICoupon } from "@/types/couponTypes";

interface CouponCardProps {
  coupon: ICoupon;
  onEdit: (coupon: ICoupon) => void;
  onDelete: (id: string) => void;
}

export function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  const [copied, setCopied] = React.useState(false);

  const usagePercentage = coupon.usageLimit
    ? (coupon.usedCount / coupon.usageLimit) * 100
    : 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = React.useMemo(() => {
    if (!coupon.isActive) return "Inactive";
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < new Date()) return "Expired";
    return "Active";
  }, [coupon.isActive, coupon.expiryDate]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-6 transition-all hover:shadow-md">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Tag className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase">
                {coupon.code}
              </h3>

              <div className="relative group/copy">
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "relative p-2 rounded-xl transition-all duration-500 overflow-hidden",
                    copied
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400",
                  )}
                  title="Copy code"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center transition-all duration-500",
                      copied ? "scale-0 rotate-90" : "scale-100 rotate-0",
                    )}
                  >
                    <Copy className="h-4 w-4" />
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-500",
                      copied ? "scale-100 rotate-0" : "scale-0 -rotate-90",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                </button>

                {copied && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 pointer-events-none">
                    Copied!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            </div>
            <Badge
              className={cn(
                "rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                status === "Active" && "bg-blue-600 text-white",
                status === "Inactive" &&
                  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                status === "Expired" &&
                  "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
              )}
            >
              {status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {coupon.discountType === "PERCENTAGE"
              ? `${coupon.discountValue}% off`
              : `$${coupon.discountValue} off`}{" "}
            discount
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Expires:{" "}
              {coupon.expiryDate
                ? new Date(coupon.expiryDate).toLocaleDateString()
                : "No expiry"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(coupon)}
            className="rounded-xl border-slate-200 text-slate-600 h-9 font-bold px-4 hover:bg-slate-50"
          >
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(coupon.id)}
            className="rounded-xl border-rose-100/50 text-rose-500 h-9 font-bold px-4 hover:bg-rose-50 hover:text-rose-600 bg-rose-50/30"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Usage Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Uses
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {coupon.usedCount} / {coupon.usageLimit || "∞"}
            </span>
          </div>
          {coupon.usageLimit && (
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-1 flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Remaining
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {coupon.usageLimit
              ? coupon.usageLimit - coupon.usedCount
              : "Unlimited"}
          </span>
        </div>

        <div className="md:col-span-1 flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Revenue
          </span>
          <span className="text-lg font-bold text-emerald-500">
            $
            {(coupon.payments || [])
              .reduce((acc, curr) => acc + (curr.finalAmount || 0), 0)
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>

        <div className="md:col-span-1 flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Net Discount
          </span>
          <span className="text-lg font-bold text-purple-500">
            $
            {(coupon.payments || [])
              .reduce((acc, curr) => acc + (curr.discountAmount || 0), 0)
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>
    </div>
  );
}
