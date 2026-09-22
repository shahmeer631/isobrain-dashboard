"use client";

import React from "react";
import { Zap, Users, TrendingUp, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { useGetUsageUnitsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { StatCard } from "@/components/dashboard/(admin)/usage-units/StatCard";
import { PlanCard } from "@/components/dashboard/(admin)/usage-units/PlanCard";
import { UsageSkeleton } from "@/components/dashboard/(admin)/usage-units/UsageSkeleton";

const UsageUnitsPage = () => {
  const { data, isLoading, isError, refetch } = useGetUsageUnitsQuery();

  const stats = data?.data?.stats;
  const plans = data?.data?.plans || [];

  if (isError) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-rose-500 font-bold text-lg">Failed to load usage units data</p>
          <button 
            onClick={() => refetch()} 
            className="px-6 py-2 rounded-lg border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-600"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return <UsageSkeleton />;
  }

  return (
    <Container>
      <div className="w-full flex flex-col gap-8 pb-12">
        <PageHeader 
          title="Usage Units Management" 
          subtitle="Control learning units allocation for each plan"
        />

        {/* Overview Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Units Issued" 
            value={stats?.totalUnitsIssued?.toLocaleString() || "0"} 
            icon={<Zap className="h-6 w-6" />}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard 
            title="Active Subscribers" 
            value={stats?.activeSubscribers?.toLocaleString() || "0"} 
            icon={<Users className="h-6 w-6" />}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatCard 
            title="Avg. Units Used" 
            value={stats?.avgUnitsUsed?.toLocaleString() || "0"} 
            icon={<TrendingUp className="h-6 w-6" />}
            iconBg="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Detailed Plan Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.planName} plan={plan} />
          ))}
        </div>

        {/* Instructional Information Footer */}
        <UsageInfoBox />
      </div>
    </Container>
  );
};

const UsageInfoBox = React.memo(() => (
  <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-2 text-[#0284c7]">
      <Lightbulb className="h-5 w-5" />
      <h3 className="font-bold text-[16px]">Usage Units Information</h3>
    </div>
    <ul className="space-y-3 text-slate-600 font-medium text-[14px]">
      {[
        { label: "Learning Units", desc: "are consumed when users access AI features like ISO Navigator, Audit Lens, and Master Lab" },
        { label: "Average Usage", desc: "shows how many units users typically consume per month" },
        { label: "Usage Rate", desc: "indicates what percentage of allocated units are being used" },
        { label: "Adjust units allocation", desc: "based on user demand and feature usage patterns" },
      ].map((item, idx) => (
        <li key={idx} className="flex gap-2">
          <span className="text-[#0ea5e9]">•</span>
          <p><span className="font-bold text-[#0369a1]">{item.label}</span> {item.desc}</p>
        </li>
      ))}
    </ul>
  </div>
));

UsageInfoBox.displayName = "UsageInfoBox";

export default UsageUnitsPage;