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
        "bg-white dark:bg-[var(--ib-dk)] rounded-2xl p-6 border border-[var(--ib-line)] dark:border-[var(--ib-line)] h-full",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-[var(--ib-ink)] dark:text-white mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--ib-bg)]/50 dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] hover:bg-white dark:hover:bg-[var(--ib-dk)] transition-all hover:shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-[var(--ib-ink)] dark:text-white">
                {product.name}
              </p>
              <p className="text-xs font-semibold text-[var(--ib-mute)]">
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
