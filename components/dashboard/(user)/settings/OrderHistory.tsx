"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderData {
  id: string;
  date: string;
  item: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

const MOCK_ORDERS: OrderData[] = [
  {
    id: "INV-2024-001",
    date: "2024-02-15",
    item: "ISO 9001:2015 Complete Course",
    amount: "$149.00",
    status: "Paid",
  },
  {
    id: "INV-2024-002",
    date: "2024-02-15",
    item: "ISO 9001:2015 Complete Course",
    amount: "$149.00",
    status: "Paid",
  },
  {
    id: "INV-2024-003",
    date: "2024-02-15",
    item: "ISO 9001:2015 Complete Course",
    amount: "$149.00",
    status: "Paid",
  },
  {
    id: "INV-2024-004",
    date: "2024-02-15",
    item: "ISO 9001:2015 Complete Course",
    amount: "$149.00",
    status: "Paid",
  },
];

export function OrderHistory() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Order History
          </h2>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 font-bold">
          <Download className="h-3.5 w-3.5" />
          Export All
        </Button>
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white">
                  Item
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_ORDERS.map((order, i) => (
                <tr
                   key={i}
                   className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-300">
                    {order.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 font-semibold px-2 py-0 border-transparent"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing 4 of 24 orders
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
