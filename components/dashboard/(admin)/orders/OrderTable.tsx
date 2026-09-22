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
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-blue-500 font-semibold">
                      #{order.id?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {order.user?.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
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
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
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
                    className="px-6 py-10 text-center text-slate-500"
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
