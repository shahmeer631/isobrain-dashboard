"use client";

import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreateCustomerPortalMutation, useGetProfileQuery } from "@/lib/redux/features/user/userApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function PaymentMethods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCustomerPortal, { isLoading }] = useCreateCustomerPortalMutation();
  const { data: profileResponse } = useGetProfileQuery();

  const user = profileResponse?.data;
  console.log("User subscription data:", user);
  const isCancelled = !user || user.subscribed !== "SUBSCRIBED";

  const handleConfirm = async () => {
    try {
      const response = await createCustomerPortal().unwrap();
      if (response.success && response.data?.url) {
        toast.success(response.message || "Customer portal created successfully");
        // Redirect to the URL
        window.location.href = response.data.url;
        setIsModalOpen(false);
      } else {
        toast.error("Failed to retrieve redirection URL");
      }
    } catch (error: any) {
      console.error("Failed to create customer portal:", error);
      toast.error(error?.data?.message || "Failed to initiate billing portal");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Payment Methods
          </h2>
        </div>
        {/* <Button variant="outline" size="sm" className="h-8">
          Add Payment Method
        </Button> */}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-md bg-linear-to-l from-purple-600 to-indigo-600 text-white shadow-purple-900/40 flex items-center justify-center shadow-inner">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Active Payment Method
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your subscription and billing details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-[10px] px-2 py-0"
            >
              Default
            </Badge>
            <button
              disabled={isCancelled}
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-red-500 dark:text-red-400 hover:text-red-900 dark:hover:text-white transition-colors cursor-pointer disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center text-center gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-2">
              <div className="text-5xl md:text-6xl drop-shadow-md">🛑</div>
              <DialogTitle className="text-2xl md:text-3xl lg:text-2xl font-black text-red-600 dark:text-red-500 tracking-tight leading-tight text-center md:text-left">
                Wait! Don't walk away without your certificate.
              </DialogTitle>
              <DialogDescription className="sr-only">
                Cancellation warning and alternative options.
              </DialogDescription>
            </div>

            <div className="text-[15px] sm:text-base md:text-lg text-slate-700 dark:text-slate-300 space-y-4 font-medium leading-relaxed max-w-4xl">
              <p>
                You haven't finished your CPD training or earned your ISO Standard certification yet. Since you have already invested in your previous subscription, don't let that time and money go to waste by leaving empty-handed.
              </p>
              <p>
                Our advice: Keep your account active for just one more month. Put your head down, finish your courses, and claim the certification you set out to achieve.
              </p>
              <p className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 p-4 rounded-xl mt-4">
                If you cancel today, your discounted lifetime rate is gone forever. If you decide to return later to finish what you started, you will be required to pay a Subscription Activation Fee plus our standard monthly rates:
              </p>
            </div>

            <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-700 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">

                {/* Tier 1 */}
                <div className="flex flex-col items-center md:items-start justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="font-black text-slate-800 dark:text-slate-200 text-lg mb-2">ISOBrain Plus</span>
                  <div className="flex flex-col md:flex-row items-center gap-2 text-base md:text-lg">
                    <span className="text-slate-400 line-through decoration-2">$30</span>
                    <span className="text-red-600 dark:text-red-400 font-black flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/30 whitespace-nowrap">
                      ➡️ $200 / mo <span className="ml-1">📈</span>
                    </span>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="flex flex-col items-center md:items-start justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="font-black text-slate-800 dark:text-slate-200 text-lg mb-2">ISOBrain Pro</span>
                  <div className="flex flex-col md:flex-row items-center gap-2 text-base md:text-lg">
                    <span className="text-slate-400 line-through decoration-2">$49</span>
                    <span className="text-red-600 dark:text-red-400 font-black flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/30 whitespace-nowrap">
                      ➡️ $300 / mo <span className="ml-1">📈</span>
                    </span>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="flex flex-col items-center md:items-start justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="font-black text-slate-800 dark:text-slate-200 text-lg mb-2">ISOBrain Ultra</span>
                  <div className="flex flex-col md:flex-row items-center gap-2 text-base md:text-lg">
                    <span className="text-slate-400 line-through decoration-2">$65</span>
                    <span className="text-red-600 dark:text-red-400 font-black flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/30 whitespace-nowrap">
                      ➡️ $400 / mo <span className="ml-1">📈</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-base md:text-lg font-bold text-slate-600 dark:text-slate-400 max-w-3xl px-2">
              Are you sure you want to surrender your lifetime discount and leave without your certification?
            </p>

            <div className="flex flex-col md:flex-row items-stretch w-full gap-4 mt-2 max-w-4xl">
              <Button
                variant="ghost"
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full md:w-[40%] min-h-[50px] md:min-h-[64px] rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 font-bold whitespace-normal h-auto py-3 md:py-4 order-2 md:order-1 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-sm md:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Redirecting...
                  </>
                ) : (
                  "Cancel and Lose My Discount"
                )}
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "https://isobrain.ai";
                }}
                disabled={isLoading}
                className="w-full md:w-[60%] min-h-[50px] md:min-h-[64px] rounded-xl bg-[#0F9D58] hover:bg-[#0b8043] text-white font-black shadow-xl shadow-green-500/20 active:scale-95 transition-all whitespace-normal h-auto py-3 md:py-4 order-1 md:order-2 border-2 border-transparent text-base md:text-lg lg:text-xl"
              >
                Give Me One More Month to Finish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
