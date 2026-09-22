"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { IPlan } from "@/types/planTypes";
import { cn } from "@/lib/utils";

interface PlanTableProps {
  plans: IPlan[];
  onEdit: (plan: IPlan) => void;
  onDelete: (plan: IPlan) => void;
  isFetching?: boolean;
}

export function PlanTable({ plans, onEdit, onDelete, isFetching }: PlanTableProps) {
  return (
    <div
      className={cn(
        "relative transition-opacity",
        isFetching ? "opacity-50" : "opacity-100",
      )}
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Plan Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Original Price
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Units
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Validity
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Badge
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-1 whitespace-nowrap text-xs font-semibold text-slate-500 uppercase text-right pr-14">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                          {plan.name}
                        </span>
                        {plan.badge === "Most Popular" && (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] font-bold h-5 px-2 text-white border-none rounded-md">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[18px] font-black text-emerald-500">
                        ${plan.discountedPrice}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-bold text-slate-400 line-through decoration-slate-300 decoration-2">
                          ${plan.originalPrice}
                        </span>
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">
                          Save ${plan.originalPrice - plan.discountedPrice}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-black text-blue-600 dark:text-blue-400">
                          {plan.learningUnits}
                        </span>
                        <span className="text-[12px] font-bold text-slate-500">
                          units
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[14px] font-bold text-slate-900 dark:text-slate-200">
                        {plan.validityDays} Days
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {plan.badge ? (
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border-none px-3 py-1 font-bold text-[10px] rounded-lg shadow-sm">
                          {plan.badge}
                        </Badge>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                          None
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        className={
                          plan.isActive
                            ? "bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3 py-1 rounded-lg border-none"
                            : "bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg border-none"
                        }
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(plan)}
                          className="h-9 w-9 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(plan)}
                          className="h-9 w-9 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded-lg shadow-sm border border-rose-100/50 dark:border-rose-900/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
