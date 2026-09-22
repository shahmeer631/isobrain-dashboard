"use client";

import React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardModal } from "@/components/dashboard/DashboardModal";

interface LogoutConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  return (
    <DashboardModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Confirm Logout"
      maxWidth="sm:max-w-[420px]"
    >
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-2">
          <LogOut className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Are you sure you want to log out?
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-[280px]">
          You will need to sign in again to access your account.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:flex-1 h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              "Yes, Logout"
            )}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
