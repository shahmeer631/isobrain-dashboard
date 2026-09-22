"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TrafficSourcesProps {
  sources?: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = [
  "text-blue-600",
  "text-emerald-500",
  "text-purple-600",
  "text-orange-600",
];

function CircularProgress({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = React.useState(circumference);
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const targetOffset = circumference - (value / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(targetOffset);

      // Animate the number
      let start = 0;
      const end = value;
      const duration = 1000;
      const totalSteps = duration / 16;
      const increment = end / totalSteps;

      const countTimer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(countTimer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-slate-100 dark:text-slate-800"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <span className="absolute text-[18px] font-black text-slate-900 dark:text-white">
        {displayValue}%
      </span>
    </div>
  );
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-10">
        Traffic Sources
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {(sources || []).map((source, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-4"
          >
            <CircularProgress
              value={source.value}
              colorClass={COLORS[index % COLORS.length]}
            />
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">
                {source.name}
              </h4>
              <p className="text-[12px] font-medium text-slate-500 uppercase tracking-tight">
                Traffic share
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
