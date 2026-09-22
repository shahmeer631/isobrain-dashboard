"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProductData {
  name: string;
  sales: string;
  amount: string;
}

interface TopSellingProductsProps {
  products: ProductData[];
  className?: string;
}

export function TopSellingProducts({
  products,
  className,
}: TopSellingProductsProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 h-full",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {product.name}
              </p>
              <p className="text-xs font-semibold text-slate-400">
                {product.sales} sales
              </p>
            </div>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {product.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
