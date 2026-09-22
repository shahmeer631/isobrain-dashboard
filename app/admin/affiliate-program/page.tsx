"use client";

import React, { useState } from "react";
import Contents from "@/components/dashboard/(admin)/affiliate/contents";
import { AddAffiliateModal } from "@/components/dashboard/(admin)/affiliate/AddAffiliateModal";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { DollarSign, Plus, TrendingUp, Users } from "lucide-react";
import { useGetAffiliateStatsQuery } from "@/lib/redux/features/affiliate/affiliateApi";

// ─── Page ────────────────────────────────────────────────────────────────────────

const AffiliateProgramPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: statsData, isLoading: isStatsLoading } = useGetAffiliateStatsQuery();

  const stats = [
    {
      label: "Total Affiliates",
      value: statsData?.data?.totalAffiliates?.toString() || "0",
      icon: Users,
      iconColor: "text-blue-500 bg-blue-300/20",
      trend: "up" as const,
      trendValue: "12.9%", // Trend not in API yet, keeping mock text or removing
    },
    {
      label: "Total Revenue Generated",
      value: `$${statsData?.data?.totalRevenue?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      iconColor: "text-green-500 bg-green-300/20",
      trend: "up" as const,
      trendValue: "23.1%",
    },
    {
      label: "Total Commissions",
      value: `$${statsData?.data?.totalCommission?.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "text-purple-500 bg-purple-300/20",
      trend: "down" as const,
      trendValue: "5.8%",
    },
    {
      label: "Total Sales This Month",
      value: statsData?.data?.totalSalesThisMonth?.toString() || "0",
      icon: TrendingUp,
      iconColor: "text-orange-500 bg-orange-300/20",
      trend: "up" as const,
      trendValue: "+2",
    },
  ];

  return (
    <Container>
      <PageHeader
        title="Affiliate Program"
        subtitle="Manage affiliates, track sales, and monitor commissions"
        actions={
          <Button
            variant="primary"
            className="h-12 px-8"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-5 h-5 stroke-[4px]" />
            Add New Affiliate
          </Button>
        }
      />

      {/* ── Stats Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} isLoading={isStatsLoading} />
        ))}
      </div>

      {/* ── Affiliate Table ─────────────────────────────────────────────────── */}

      <main className="w-full">
        <Contents />
      </main>

      <AddAffiliateModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        mode="create"
      />
    </Container>
  );
};

export default AffiliateProgramPage;
