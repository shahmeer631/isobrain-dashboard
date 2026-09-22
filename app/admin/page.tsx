"use client";
import { useState } from "react";
import { useGetDashboardStatsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { useGetCoursesQuery } from "@/lib/redux/features/course/courseApi";
import {
  DollarSign,
  Users,
  Zap,
  BookOpen,
  Download,
  PlusSquare,
  Upload,
  Video,
  ShoppingCart,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { RecentlyEditedCard } from "@/components/dashboard/RecentlyEditedCard";
import { RecentOrderRow } from "@/components/dashboard/RecentOrderRow";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Button } from "@/components/ui/button";
import { ChooseProductModal } from "@/components/dashboard/ChooseProductModal";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Sample Data ──────────────────────────────────────────────────────────────

const quickActions = [
  { icon: PlusSquare, label: "Create Course", link: "/admin/courses" },
  { icon: Upload, label: "Upload ISO Standard", link: "/admin/iso-standards" },
  { icon: Video, label: "Add Video", link: "/admin/video-library" },
  { icon: ShoppingCart, label: "Create Bundle", link: "/admin/bundles" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetDashboardStatsQuery();
  const loading = isLoading || isFetching;

  const { data: coursesResponse, isLoading: isCoursesLoading } = useGetCoursesQuery({ limit: 6 });

  const dashboardStats = data?.data?.stats;
  const apiOrders = data?.data?.recentOrders || [];

  const stats = [
    {
      label: "Total Revenue",
      value: dashboardStats ? `$${dashboardStats.totalRevenue.toLocaleString()}` : "$0",
      icon: DollarSign,
      iconColor: "text-green-500 bg-green-300/20",
      trend: "up" as const,
      trendValue: "+12.9%",
    },
    {
      label: "Accounts Created",
      value: dashboardStats ? dashboardStats.totalUsers.toLocaleString() : "0",
      icon: Users,
      iconColor: "text-blue-500 bg-blue-300/20",
      trend: "up" as const,
      trendValue: "+23.1%",
    },
    {
      label: "New Leads",
      value: dashboardStats ? dashboardStats.newLeads.toLocaleString() : "0",
      icon: Zap,
      iconColor: "text-purple-500 bg-purple-300/20",
      trend: "down" as const,
      trendValue: "-5.8%",
    },
    {
      label: "Active Courses",
      value: dashboardStats ? dashboardStats.activeCourses.toLocaleString() : "0",
      icon: BookOpen,
      iconColor: "text-orange-500 bg-orange-300/20",
      trend: "up" as const,
      trendValue: "+2",
    },
  ];

  const recentOrders = apiOrders.map((order) => ({
    orderId: `#${order.id.slice(-4).toUpperCase()}`,
    status: order.status === "SUCCEEDED" ? ("Completed" as const) : ("Pending" as const),
    customerName: `${order.user.firstName} ${order.user.lastName}`,
    productName: order.plan.name,
    amount: `$${order.finalAmount}`,
  }));

  const recentlyEdited = coursesResponse?.data?.map((course) => {
    let uiStatus: "Published" | "Draft" | "Archived" | "Pending" = "Draft";
    if (course.status === "PUBLISHED") uiStatus = "Published";
    else if (course.status === "ARCHIVED") uiStatus = "Archived";

    return {
      id: course.id,
      imageSrc: course.thumbnail || "/image 1.png",
      contentType: course.category?.name || "Course",
      title: course.title,
      editedBy: course.instructor || "Unknown",
      editedAt: new Date(course.updatedAt || course.createdAt).toLocaleDateString(),
      status: uiStatus,
    };
  }) || [];

  return (
    <Container>
      {/* ── Header ─────────────────────────────────────────────── */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Monitor your platform performance and activity"
        actions={
          <>
            {/* <Button variant="outline" className="p-5">
              Download Report
            </Button> */}
            <Button
              variant={"primary"}
              className="p-5 text-md"
              onClick={() => setIsProductModalOpen(true)}
            >
              Create New Course
            </Button>
          </>
        }
      />

      {/* ── Stats Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} isLoading={loading} />
        ))}
      </div>

      {/* ── Recently Edited ────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Recently Edited
          </h2>
          <Button
            variant="link"
            className="text-sm text-thin font-semibold p-0 h-auto"
          >
             {/* View All */}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isCoursesLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="flex flex-col gap-5 p-6">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : recentlyEdited.length > 0 ? (
            recentlyEdited.map((item) => (
              <RecentlyEditedCard key={item.id} {...item} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              No recent courses found.
            </div>
          )}
        </div>
      </section>

      {/* ── Recent Orders ──────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Orders
            </h2>
            <Button
              variant="link"
              className="text-sm text-thin font-semibold p-0 h-auto"
            >
              {/* View All */}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 px-6 py-5"
                >
                  <div className="flex flex-col gap-2 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-3/4 max-w-[150px]" />
                    <Skeleton className="h-3 w-1/2 max-w-[100px]" />
                  </div>
                  <Skeleton className="h-6 w-16 shrink-0" />
                </div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <RecentOrderRow key={order.orderId} {...order} />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No recent orders found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl bg-[#ffffffb2] border border-slate-100/30 shadow-sm p-4  ">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.label}
                icon={action.icon}
                label={action.label}
                link={action.link}
               
              />
            ))}
            
          </div>
        </div>
      </section>
      <ChooseProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
      />
    </Container>
  );
}
