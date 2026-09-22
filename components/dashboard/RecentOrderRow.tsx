import { cn } from "@/lib/utils";

export type OrderStatus = "Completed" | "Pending" | "Failed" | "Refunded";

interface RecentOrderRowProps {
  orderId: string;
  status: OrderStatus;
  customerName: string;
  productName: string;
  amount: string;
  className?: string;
}

const orderStatusStyles: Record<OrderStatus, string> = {
  Completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Failed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Refunded: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

/**
 * RecentOrderRow — A single row inside the "Recent Orders" list section.
 *
 * Usage:
 *   <RecentOrderRow
 *     orderId="#2421"
 *     status="Completed"
 *     customerName="Alice Williams"
 *     productName="Quality Manager Bundle"
 *     amount="$299"
 *   />
 */
export function RecentOrderRow({
  orderId,
  status,
  customerName,
  productName,
  amount,
  className,
}: RecentOrderRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 px-6 py-5 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/70",
        className,
      )}
    >
      {/* Left: ID, status, name, product */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
            {orderId}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
              orderStatusStyles[status],
            )}
          >
            {status}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
          {customerName}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
          {productName}
        </p>
      </div>

      {/* Right: amount */}
      <span className="shrink-0 text-base font-bold text-emerald-500 dark:text-emerald-400">
        {amount}
      </span>
    </div>
  );
}
