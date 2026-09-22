"use client";

import React from "react";
import { Award, CheckCircle, Download, Calendar } from "lucide-react";
import { DashboardStatCard } from "../../DashboardStatCard";

import { CertificateStatsSkeleton } from "./CertificateSkeleton";

interface CertificateStatsProps {
  stats?: {
    totalCertificates: number;
    activeTemplates: number;
    downloadsThisMonth: number;
    issuedThisWeek: number;
  };
  isLoading?: boolean;
}

export function CertificateStats({ stats, isLoading }: CertificateStatsProps) {
  if (isLoading) {
    return <CertificateStatsSkeleton />;
  }

  const statsConfig = [
    {
      label: "Total Certificates Issued",
      value: stats?.totalCertificates?.toLocaleString() || "0",
      icon: Award,
      iconColor: "from-indigo-500/20 to-indigo-600/20 text-indigo-600",
    },
    {
      label: "Active Templates",
      value: stats?.activeTemplates?.toLocaleString() || "0",
      icon: CheckCircle,
      iconColor: "from-emerald-500/20 to-emerald-600/20 text-emerald-600",
    },
    {
      label: "Downloads This Month",
      value: stats?.downloadsThisMonth?.toLocaleString() || "0",
      icon: Download,
      iconColor: "from-purple-500/20 to-purple-600/20 text-purple-600",
    },
    {
      label: "Issued This Week",
      value: stats?.issuedThisWeek?.toLocaleString() || "0",
      icon: Calendar,
      iconColor: "from-orange-500/20 to-orange-600/20 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <DashboardStatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
