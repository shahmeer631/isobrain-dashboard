import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderStatCardProps {
  label: string;
  value: string;
  valueColor?: string;
  className?: string;
}

export function OrderStatCard({
  label,
  value,
  valueColor = "text-slate-900",
  className,
}: OrderStatCardProps) {
  return (
    <Card
      className={cn(
        "border-none bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className={cn("text-3xl font-bold tracking-tight", valueColor)}>
            {value}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
