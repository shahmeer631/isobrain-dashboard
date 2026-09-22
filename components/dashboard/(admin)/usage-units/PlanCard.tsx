import React from "react";

interface PlanCardProps {
  plan: {
    planName: string;
    learningUnits: number;
    users: number;
    totalUnits: number;
    avgUsage: number;
    usageRate: number;
  };
}

export const PlanCard = React.memo(({ plan }: PlanCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-100 flex flex-col gap-8 transition-colors">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{plan.planName}</h3>
        <span className="bg-[#4f46e5] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase leading-5">Plan</span>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">Learning Units</p>
        <h4 className="text-4xl font-bold text-[#2563eb]">{plan.learningUnits?.toLocaleString() || "0"}</h4>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-semibold text-sm">Users with Plan</span>
          <span className="font-bold text-slate-900">{plan.users?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-semibold text-sm">Total Units Issued</span>
          <span className="font-bold text-[#10b981]">{plan.totalUnits?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-semibold text-sm">Avg. Usage</span>
          <span className="font-bold text-[#a855f7]">{plan.avgUsage?.toLocaleString() || "0"} units</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-semibold text-sm">Usage Rate</span>
          <span className="font-bold text-slate-900">{plan.usageRate || 0}%</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
          <span>Utilization</span>
          <span>{plan.usageRate}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-700 ease-in-out"
            style={{ width: `${plan.usageRate}%` }}
          />
        </div>
      </div>
    </div>
  );
});

PlanCard.displayName = "PlanCard";
