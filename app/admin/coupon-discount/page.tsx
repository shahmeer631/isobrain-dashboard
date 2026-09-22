// "use client";

// import React, { useState } from "react";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { PageHeader } from "@/components/dashboard/PageHeader";
// import Container from "@/components/ui/container";
// import { FilterBar } from "@/components/dashboard/FilterBar";
// import { CouponStats } from "@/components/dashboard/(admin)/marketing/CouponStats";
// import { CouponCard } from "@/components/dashboard/(admin)/marketing/CouponCard";
// import { CouponModal } from "@/components/dashboard/(admin)/marketing/CouponModal";

// interface Coupon {
//   id: string;
//   code: string;
//   type: "percentage" | "fixed";
//   value: number;
//   expiresAt: string | null;
//   status: "Active" | "Scheduled" | "Expired";
//   uses: number;
//   limit: number | null;
//   revenueGenerated: string;
//   conversionRate: string;
// }

// const MOCK_COUPONS: Coupon[] = [
//   {
//     id: "1",
//     code: "SUMMER2024",
//     type: "percentage",
//     value: 25,
//     expiresAt: "2024-08-31",
//     status: "Active",
//     uses: 87,
//     limit: 200,
//     revenueGenerated: "$12,435",
//     conversionRate: "43.5%",
//   },
//   {
//     id: "2",
//     code: "NEWUSER50",
//     type: "percentage",
//     value: 50,
//     expiresAt: "2024-12-31",
//     status: "Active",
//     uses: 234,
//     limit: 500,
//     revenueGenerated: "$8,756",
//     conversionRate: "46.8%",
//   },
//   {
//     id: "3",
//     code: "BLACKFRIDAY",
//     type: "fixed",
//     value: 100,
//     expiresAt: "2024-11-30",
//     status: "Scheduled",
//     uses: 156,
//     limit: 300,
//     revenueGenerated: "$23,400",
//     conversionRate: "52.0%",
//   },
//   {
//     id: "4",
//     code: "PARTNER20",
//     type: "percentage",
//     value: 20,
//     expiresAt: null,
//     status: "Active",
//     uses: 45,
//     limit: null,
//     revenueGenerated: "$4,230",
//     conversionRate: "100.0%",
//   },
// ];

// const CouponDiscountPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"create" | "edit">("create");
//   const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

//   const filteredCoupons = MOCK_COUPONS.filter((coupon) => {
//     const matchesSearch = coupon.code
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesFilter =
//       activeFilter === "All" || coupon.status === activeFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const handleCreateNew = () => {
//     setModalMode("create");
//     setSelectedCoupon(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (coupon: Coupon) => {
//     setModalMode("edit");
//     setSelectedCoupon(coupon);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     console.log("Delete coupon", id);
//     // In a real app, this would be an API call
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleSubmit = (data: any) => {
//     console.log("Submit coupon data:", data);
//     // In a real app, this would be an API call
//   };

//   return (
//     <Container>
//       <div className="max-w-8xl mx-auto w-full flex flex-col gap-8">
//         <PageHeader
//           title="Coupons & Discounts"
//           subtitle="Create and manage promotional discount codes"
//           actions={
//             <Button
//               onClick={handleCreateNew}
//               variant="primary"
//               className="h-12 px-6 flex items-center gap-2"
//             >
//               <Plus className="h-5 w-5" />
//               Create Coupon
//             </Button>
//           }
//         />

//         {/* Stats Row */}
//         <CouponStats />

//         {/* Filter Bar */}
//         <FilterBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           activeFilter={activeFilter}
//           setActiveFilter={setActiveFilter}
//           filters={["All", "Active", "Scheduled", "Expired"]}
//           placeholder="Search coupons by code..."
//         />

//         {/* Coupons List */}
//         <div className="flex flex-col gap-6">
//           {filteredCoupons.length > 0 ? (
//             filteredCoupons.map((coupon) => (
//               <CouponCard
//                 key={coupon.id}
//                 coupon={coupon}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))
//           ) : (
//             <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
//               <p className="text-slate-500 font-medium">
//                 No coupons found matching your criteria.
//               </p>
//             </div>
//           )}
//         </div>

//         <CouponModal
//           key={`${selectedCoupon?.id || "new"}-${isModalOpen}`}
//           open={isModalOpen}
//           onOpenChange={setIsModalOpen}
//           mode={modalMode}
//           initialData={selectedCoupon}
//           onSubmit={handleSubmit}
//         />
//       </div>
//     </Container>
//   );
// };

// export default CouponDiscountPage;

"use client";

import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CouponStats } from "@/components/dashboard/(admin)/marketing/CouponStats";
import { CouponCard } from "@/components/dashboard/(admin)/marketing/CouponCard";
import { CouponModal } from "@/components/dashboard/(admin)/marketing/CouponModal";
import { DeleteConfirmationModal } from "@/components/dashboard/(admin)/bundles/DeleteConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/lib/redux/features/coupon/couponApi";
import {
  ICoupon,
  ICreateCouponRequest,
  IUpdateCouponRequest,
} from "@/types/couponTypes";
import { toast } from "sonner";
// import { Pagination } from "@/components/dashboard/Pagination";

const CouponDiscountPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: couponsData, isLoading, isError } = useGetCouponsQuery();

  const filteredCoupons = React.useMemo(() => {
    const list = couponsData?.data?.data;
    if (!list) return [];

    return list.filter((coupon) => {
      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const getStatus = (c: ICoupon) => {
        if (!c.isActive) return "EXPIRED";
        const expiryDate = new Date(c.expiryDate);
        if (expiryDate < new Date()) return "EXPIRED";
        return "ACTIVE";
      };

      const status = getStatus(coupon);
      const matchesFilter =
        activeFilter === "All" || status === activeFilter.toUpperCase();

      return matchesSearch && matchesFilter;
    });
  }, [couponsData, searchQuery, activeFilter]);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateNew = () => {
    setModalMode("create");
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: ICoupon) => {
    setModalMode("edit");
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await deleteCoupon(deletingId).unwrap();
      if (res.success) {
        toast.success(res.message || "Coupon deleted successfully");
        setIsDeleteOpen(false);
        setDeletingId(null);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete coupon");
    }
  };

  const handleSubmit = async (
    data: ICreateCouponRequest | Partial<ICoupon>,
  ) => {
    try {
      if (modalMode === "create") {
        const res = await createCoupon(data as ICreateCouponRequest).unwrap();
        if (res.success) {
          toast.success("Coupon created successfully");
          setIsModalOpen(false);
        }
      } else if (selectedCoupon) {
        const res = await updateCoupon({
          id: selectedCoupon.id,
          body: data as IUpdateCouponRequest,
        }).unwrap();
        if (res.success) {
          toast.success("Coupon updated successfully");
          setIsModalOpen(false);
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const renderSkeletons = () => (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[200px] w-full rounded-2xl" />
      ))}
    </div>
  );

  return (
    <Container>
      <div className="max-w-8xl mx-auto w-full flex flex-col gap-8">
        <PageHeader
          title="Coupons & Discounts"
          subtitle="Create and manage promotional discount codes"
          actions={
            <Button
              onClick={handleCreateNew}
              variant="primary"
              className="h-12 px-6 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Coupon
            </Button>
          }
        />

        {/* Stats Row */}
        <CouponStats stats={couponsData?.data?.stats} isLoading={isLoading} />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filters={["All", "Active", "Expired"]}
          placeholder="Search coupons by code..."
        />

        {/* Coupons List */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : isError ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
              <p className="text-rose-500 font-medium">
                Failed to load coupons. Please try again later.
              </p>
            </div>
          ) : filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                No coupons found
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>

        <CouponModal
          key={`${selectedCoupon?.id || "new"}-${isModalOpen}`}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          mode={modalMode}
          initialData={selectedCoupon}
          onSubmit={handleSubmit}
          isLoading={isCreating || isUpdating}
        />

        <DeleteConfirmationModal
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Coupon"
          description="Are you sure you want to delete this coupon? This action cannot be undone."
        />
      </div>
    </Container>
  );
};

export default CouponDiscountPage;
