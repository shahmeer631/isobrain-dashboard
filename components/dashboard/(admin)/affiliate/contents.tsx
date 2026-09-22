"use client";

import { Copy, MoreVertical, Search, Trash2, Edit, Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useGetAffiliatesQuery, 
  useDeleteAffiliateMutation 
} from "@/lib/redux/features/affiliate/affiliateApi";
import { IAffiliate } from "@/types/affiliateTypes";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AddAffiliateModal } from "./AddAffiliateModal";
import { DeleteConfirmationModal } from "../bundles/DeleteConfirmationModal";

const Contents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 1;

  const { data: affiliatesData, isLoading, isFetching } = useGetAffiliatesQuery({
    search: searchQuery,
    page,
    limit,
  });

  const [deleteAffiliate, { isLoading: isDeleting }] = useDeleteAffiliateMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<IAffiliate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Affiliate code copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (affiliate: IAffiliate) => {
    setSelectedAffiliate(affiliate);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (affiliate: IAffiliate) => {
    setSelectedAffiliate(affiliate);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAffiliate) return;
    try {
      await deleteAffiliate(selectedAffiliate.id).unwrap();
      toast.success("Affiliate deleted successfully");
      setIsDeleteOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete affiliate");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const totalPages = affiliatesData?.meta?.total ? Math.ceil(affiliatesData.meta.total / limit) : 0;

  const renderSkeletons = () => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="hover:bg-gray-50/70 border-b border-slate-50 last:border-b-0">
          <td className="py-4 pl-4 pr-3 sm:pl-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </td>
          <td className="hidden px-3 py-4 sm:table-cell lg:px-4">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="px-3 py-4 lg:px-4">
            <Skeleton className="h-4 w-12" />
          </td>
          <td className="hidden px-3 py-4 md:table-cell lg:px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="hidden px-3 py-4 md:table-cell lg:px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="px-3 py-4 lg:px-4">
            <Skeleton className="h-5 w-16 rounded-full" />
          </td>
          <td className="py-4 pl-3 pr-4 text-right lg:pr-6">
            <Skeleton className="h-5 w-5 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Affiliates</h2>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              {(isLoading || isFetching) && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:px-6">Affiliate</th>
                  <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell lg:px-4">Affiliate Code</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:px-4">Sales</th>
                  <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell lg:px-4">Revenue</th>
                  <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell lg:px-4">Commission</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:px-4">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 lg:pr-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  renderSkeletons()
                ) : affiliatesData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No affiliates found.
                    </td>
                  </tr>
                ) : (
                  affiliatesData?.data?.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-50/70">
                      <td className="max-w-[220px] py-4 pl-4 pr-3 sm:pl-6 lg:pl-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                            {getInitials(affiliate.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">{affiliate.name}</div>
                            <div className="mt-0.5 text-sm text-gray-500 truncate">{affiliate.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell lg:px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700 uppercase">{affiliate.affiliateCode}</span>
                          <div className="relative group/copy">
                            <button
                              onClick={() => handleCopy(affiliate.id, affiliate.affiliateCode)}
                              className={cn(
                                "relative p-2 rounded-xl transition-all duration-500 overflow-hidden",
                                copiedId === affiliate.id 
                                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                                  : "hover:bg-slate-100 text-slate-400"
                              )}
                              title="Copy code"
                            >
                              <div className={cn(
                                "flex items-center justify-center transition-all duration-500",
                                copiedId === affiliate.id ? "scale-0 rotate-90" : "scale-100 rotate-0"
                              )}>
                                <Copy className="h-4 w-4" />
                              </div>
                              <div className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-500",
                                copiedId === affiliate.id ? "scale-100 rotate-0" : "scale-0 -rotate-90"
                              )}>
                                <Check className="h-4 w-4" />
                              </div>
                            </button>
                            
                            {copiedId === affiliate.id && (
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 pointer-events-none z-50">
                                Copied!
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 lg:px-4">
                        {affiliate.totalSales} sales
                      </td>

                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-900 md:table-cell lg:px-4">
                        ${affiliate.totalRevenue.toLocaleString()}
                      </td>

                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm font-medium text-green-600 md:table-cell lg:px-4">
                        ${affiliate.totalCommission.toLocaleString()}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm lg:px-4">
                        <span className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          affiliate.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                          affiliate.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {affiliate.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium lg:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600 outline-none">
                              <MoreVertical size={18} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-xl">
                            <DropdownMenuItem onClick={() => handleEdit(affiliate)} className="gap-2 cursor-pointer text-slate-600">
                              <Edit size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(affiliate)} className="gap-2 text-rose-600 hover:text-rose-600! cursor-pointer">
                              <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * limit, affiliatesData?.meta?.total || 0)}
                  </span>{" "}
                  of <span className="font-medium">{affiliatesData?.meta?.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-gray-300",
                        page === i + 1
                          ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-indigo-600"
                          : "text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Commission Settings - Static Section */}
      <div className="rounded-xl border hidden border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Commission Settings</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <label
              htmlFor="commission-rate"
              className="block text-sm text-gray-700 font-bold"
            >
              Default Commission Rate (%)
            </label>
            <div className="relative mt-2">
              <input
                id="commission-rate"
                type="number"
                defaultValue={10}
                className="block w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-purple-100 sm:text-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-500 sm:text-sm font-bold">%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Percentage of sales given to affiliates
            </p>
          </div>

          <div>
            <label
              htmlFor="cookie-duration"
              className="block text-sm text-gray-700 font-bold"
            >
              Cookie Duration (days)
            </label>
            <input
              id="cookie-duration"
              type="number"
              defaultValue={30}
              className="mt-2 block w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-purple-100 sm:text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              How long the affiliate link remains valid
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            className="h-12 px-8 font-bold"
          >
            Save Settings
          </Button>
        </div>
      </div>

      <AddAffiliateModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode="edit"
        initialData={selectedAffiliate}
      />

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Affiliate"
        description={`Are you sure you want to delete ${selectedAffiliate?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Contents;