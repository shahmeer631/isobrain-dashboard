"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/orders";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useState } from "react";

interface OrderTableProps {
  orders: Order[];
  isFetching?: boolean;
}

export function OrderTable({ orders, isFetching }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div
      className={cn(
        "relative transition-opacity",
        isFetching ? "opacity-50" : "opacity-100",
      )}
    >
      <div className="bg-white dark:bg-[var(--ib-dk)] rounded-xl shadow-sm border border-[var(--ib-line)] dark:border-[var(--ib-line)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--ib-line)] dark:border-[var(--ib-line)]">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--ib-mute)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ib-line)] dark:divide-[var(--ib-line)]">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--ib-bg)]/50 dark:hover:bg-[var(--ib-dk)]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-blue-500 font-semibold">
                      #{order.id?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4 text-[var(--ib-mute)] text-sm">
                      {order.user?.email}
                    </td>
                    <td className="px-6 py-4 text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
                      {order.plan?.name}
                    </td>
                    <td className="px-6 py-4 text-emerald-500 font-bold">
                      ${order.finalAmount?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                          order.status === "SUCCEEDED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700",
                        )}
                      >
                        {order.status === "SUCCEEDED" ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--ib-mute)] text-sm">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="p-2 hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] rounded-lg text-[var(--ib-mute)]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-[var(--ib-mute)]"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        order={selectedOrder}
      />
    </div>
  );
}
