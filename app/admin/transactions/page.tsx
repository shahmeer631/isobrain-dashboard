"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, CreditCard, TrendingUp, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactionsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { StatCard } from "@/components/dashboard/(admin)/usage-units/StatCard";
import { TransactionTable } from "@/components/dashboard/(admin)/transactions/TransactionTable";
import { TransactionFilter } from "@/components/dashboard/(admin)/transactions/TransactionFilter";
import { cn } from "@/lib/utils";

const TransactionsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isFetching, isError } = useGetTransactionsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
  });

  const transactions = data?.data?.data || [];
  const meta = data?.data?.meta;
  const stats = data?.data?.stats;

  if (isError) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <p className="text-rose-500 font-bold text-[16px]">Failed to load transactions. Please try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline">Refresh Page</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full flex flex-col gap-10 pb-16">
        <PageHeader 
          title="Transactions" 
          subtitle="View and manage all subscription transactions"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
          ) : (
            <>
              <StatCard 
                title="Total Revenue" 
                value={`$${stats?.totalRevenue.toLocaleString() || "0"}`} 
                icon={<DollarSign className="h-6 w-6" />}
                iconBg="bg-emerald-50 text-emerald-600"
              />
              <StatCard 
                title="Completed" 
                value={stats?.completed.toLocaleString() || "0"} 
                icon={<CreditCard className="h-6 w-6" />}
                iconBg="bg-blue-50 text-blue-600"
              />
              <StatCard 
                title="Failed" 
                value={stats?.failed.toLocaleString() || "0"} 
                icon={<TrendingUp className="h-6 w-6" />} // Reusing icon for failed/stats
                iconBg="bg-rose-50 text-rose-600"
              />
              <StatCard 
                title="Pending" 
                value={stats?.pending.toLocaleString() || "0"} 
                icon={<CreditCard className="h-6 w-6" />}
                iconBg="bg-purple-50 text-purple-600"
              />
            </>
          )}
        </div>

        {/* Search & Filter Bar */}
        <TransactionFilter 
          search={search} 
          setSearch={setSearch} 
          status={status} 
          setStatus={setStatus} 
        />

        {/* Transactions Table Section */}
        <div className="relative">
          <TransactionTable transactions={transactions} isLoading={isLoading || isFetching} />
          {isFetching && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded-xl z-20">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && meta && meta.total > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100">
            <span className="text-[14px] font-bold text-slate-500">
              Showing <span className="text-slate-900">{(page - 1) * meta.limit + 1}-{Math.min(page * meta.limit, meta.total)}</span> of <span className="text-slate-900">{meta.total}</span> transactions
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || isFetching}
                onClick={() => setPage(p => p - 1)}
                className="h-10 px-4 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, Math.ceil(meta.total / meta.limit)) }, (_, i) => {
                  const pNum = i + 1;
                  return (
                    <Button
                      key={pNum}
                      size="sm"
                      variant={page === pNum ? "primary" : "outline"}
                      onClick={() => setPage(pNum)}
                      className={cn(
                        "h-10 w-10 rounded-xl font-bold transition-all",
                        page === pNum 
                          ? "shadow-lg shadow-blue-100 ring-2 ring-blue-500/10" 
                          : "border-slate-100 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {pNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page * meta.limit >= meta.total || isFetching}
                onClick={() => setPage(p => p + 1)}
                className="h-10 px-4 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TransactionsPage;