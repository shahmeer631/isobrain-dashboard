import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

export const StatCard = React.memo(({ title, value, icon, iconBg }: StatCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-100 flex flex-col gap-5 transition-colors">
      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconBg)}>
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
        <p className="text-slate-500 font-medium text-[15px]">{title}</p>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";
