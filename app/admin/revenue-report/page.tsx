"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { RevenueByCategory } from "@/components/dashboard/(admin)/revenue/RevenueByCategory";
import { TopSellingProducts } from "@/components/dashboard/(admin)/revenue/TopSellingProducts";
import { MonthlyGrowth } from "@/components/dashboard/(admin)/revenue/MonthlyGrowth";
import { cn } from "@/lib/utils";

const CATEGORY_DATA = [
  {
    name: "Quality Management Courses",
    amount: "$18,705",
    percentage: 65,
    color: "#2563eb", // blue-600
  },
  {
    name: "Information Security Courses",
    amount: "$13,380",
    percentage: 45,
    color: "#9333ea", // purple-600
  },
  {
    name: "ISO Standards Library",
    amount: "$7,815",
    percentage: 25,
    color: "#16a34a", // green-600
  },
  {
    name: "Course Bundles",
    amount: "$5,331",
    percentage: 15,
    color: "#ea580c", // orange-600
  },
];

const TOP_PRODUCTS = [
  {
    name: "ISO 9001:2015 Complete Guide",
    sales: "234",
    amount: "$34,866",
  },
  {
    name: "Quality Management Bundle",
    sales: "156",
    amount: "$46,644",
  },
  {
    name: "Security & Compliance Bundle",
    sales: "98",
    amount: "$39,102",
  },
];

const GROWTH_DATA = [
  {
    month: "January",
    amount: "$38,450",
    growth: "15.2%",
  },
  {
    month: "February",
    amount: "$45,231",
    growth: "17.6%",
  },
  {
    month: "March",
    amount: "$52,100",
    growth: "15.2%",
    isProjected: true,
  },
];

const RevenueReportPage = () => {
  const [activeTab, setActiveTab] = useState("This Month");

  const filterOptions = ["This Week", "This Month", "This Year"];

  return (
    <Container>
      <div className="max-w-8xl mx-auto w-full flex flex-col gap-8">
        <PageHeader
          title="Revenue Reports"
          subtitle="Track financial performance and insights"
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-11 px-4 ">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="primary" className="h-11 px-6 ">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          }
        />
<h1 className="text-center text-red-300 text-4xl">this will be removed or updated soon</h1>
        {/* Filters */}
        <div className="flex items-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveTab(option)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === option
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardStatCard
            label="Total Revenue"
            value="$45,231"
            icon={DollarSign}
            iconColor="bg-emerald-50"
            trend="up"
            trendValue="+12.5%"
          />
          <DashboardStatCard
            label="Net Profit"
            value="$18,900"
            icon={TrendingUp}
            iconColor="bg-blue-50"
            trend="up"
            trendValue="+8.2%"
          />
          <DashboardStatCard
            label="Avg Order Value"
            value="$187"
            icon={DollarSign}
            iconColor="bg-purple-50"
            trend="up"
            trendValue="$187"
          />
        </div>

        {/* Category Breakdown */}
        <RevenueByCategory categories={CATEGORY_DATA} />

        {/* Products and Growth Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <TopSellingProducts products={TOP_PRODUCTS} />
          <MonthlyGrowth data={GROWTH_DATA} />
        </div>
      </div>
    </Container>
  );
};

export default RevenueReportPage;
