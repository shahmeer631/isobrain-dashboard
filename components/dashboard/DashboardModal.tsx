"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function DashboardModal({
  open,
  onOpenChange,
  title,
  children,
  className,
  maxWidth = "sm:max-w-[600px]",
}: DashboardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden border-none rounded-3xl gap-0 max-h-[95vh] sm:max-h-[90vh] flex flex-col w-[calc(100%-2rem)] sm:w-full",
          maxWidth,
          className,
        )}
      >
        <DialogHeader className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4 shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 w-full overflow-y-auto">
          <div className="px-6 sm:px-10 pb-8 sm:pb-10">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
