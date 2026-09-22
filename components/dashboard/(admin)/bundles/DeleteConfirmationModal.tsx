"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardModal } from "@/components/dashboard/DashboardModal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Bundle",
  description = "Are you sure you want to delete this bundle? This action cannot be undone.",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <DashboardModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={title}
      maxWidth="sm:max-w-[480px]"
    >
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-2">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <p className="text-slate-500 font-medium">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50 shadow-sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:flex-1 h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 shadow-rose-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
