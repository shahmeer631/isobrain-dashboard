"use client";

import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { OrderTable } from "@/components/dashboard/(admin)/orders/OrderTable";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { OrderStats } from "@/components/dashboard/(admin)/orders/OrderStats";
import { useGetAllOrdersQuery } from "@/lib/redux/features/orders/ordersApi";
import { exportOrdersToPDF } from "@/lib/exportOrders";
import { Order } from "@/types/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


// Map UI labels → backend status values; empty string = no filter
const STATUS_MAP: Record<string, string> = {
  All: "",
  Completed: "SUCCEEDED",
  Pending: "PENDING",
};

const FILTERS = Object.keys(STATUS_MAP); // ["All", "Completed", "Pending"]

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching } = useGetAllOrdersQuery();

  const stats = data?.data?.stats;

  // ─── Client-side filter ───────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const allOrders: Order[] = data?.data?.data ?? [];
    const statusValue = STATUS_MAP[activeTab];
    const q = searchQuery.trim().toLowerCase();

    return allOrders.filter((order) => {
      if (!order) return false;
      // Status filter
      const matchesStatus = !statusValue || order?.status === statusValue;

      // Search filter: order id suffix, customer name, email, plan
      const customerName = `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.toLowerCase();
      const matchesSearch =
        !q ||
        order.id?.toLowerCase().includes(q) ||
        customerName.includes(q) ||
        (order.user?.email ?? "").toLowerCase().includes(q) ||
        (order.plan?.name ?? "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [data, activeTab, searchQuery]);

  // ─── Render Skeletons ───────────────────────────────────────────────────────
  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-lg" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Export (filtered data only) ─────────────────────────────────────────
  const handleExport = () => {
    if (filteredOrders.length > 0) {
      exportOrdersToPDF(filteredOrders);
    } else {
      alert("No data available to export.");
    }
  };

  return (
    <Container>
      <div className="container mx-auto w-full flex flex-col gap-8">
        <PageHeader
          title="Orders"
          subtitle="Manage customer orders and transactions"
          actions={
            <Button
              onClick={handleExport}
              variant="primary"
              className="h-12 px-6 flex items-center gap-2"
              disabled={filteredOrders.length === 0}
            >
              <Download className="h-4 w-4 stroke-3" />
              Export Orders
              {filteredOrders.length > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                  {filteredOrders.length}
                </span>
              )}
            </Button>
          }
        />

        {/* Stats Row */}
        {isLoading ? renderStatsSkeleton() : <OrderStats stats={stats} />}

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeTab}
          setActiveFilter={setActiveTab}
          filters={FILTERS}
          placeholder="Search by ID, customer, email or plan..."
        />

        {/* Table */}
        {isLoading ? (
          renderTableSkeleton()
        ) : (
          <OrderTable
            orders={filteredOrders}
            isFetching={isFetching}
          />
        )}
      </div>
    </Container>
  );
};

export default OrdersPage;
