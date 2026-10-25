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
    <div className="bg-white p-8 rounded-xl border border-[var(--ib-line)] flex flex-col gap-8 transition-colors">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[var(--ib-ink)] tracking-tight">{plan.planName}</h3>
        <span className="bg-[#4f46e5] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase leading-5">Plan</span>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Learning Units</p>
        <h4 className="text-4xl font-bold text-[#2563eb]">{plan.learningUnits?.toLocaleString() || "0"}</h4>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--ib-line)]">
        <div className="flex justify-between items-center">
          <span className="text-[var(--ib-mute)] font-semibold text-sm">Users with Plan</span>
          <span className="font-bold text-[var(--ib-ink)]">{plan.users?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--ib-mute)] font-semibold text-sm">Total Units Issued</span>
          <span className="font-bold text-[#10b981]">{plan.totalUnits?.toLocaleString() || "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--ib-mute)] font-semibold text-sm">Avg. Usage</span>
          <span className="font-bold text-[#a855f7]">{plan.avgUsage?.toLocaleString() || "0"} units</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--ib-mute)] font-semibold text-sm">Usage Rate</span>
          <span className="font-bold text-[var(--ib-ink)]">{plan.usageRate || 0}%</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-bold text-[var(--ib-mute)] uppercase">
          <span>Utilization</span>
          <span>{plan.usageRate}%</span>
        </div>
        <div className="h-2 w-full bg-[var(--ib-bg)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--ib-acc)] transition-all duration-700 ease-in-out"
            style={{ width: `${plan.usageRate}%` }}
          />
        </div>
      </div>
    </div>
  );
});

PlanCard.displayName = "PlanCard";
