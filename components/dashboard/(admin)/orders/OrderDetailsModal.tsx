"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/orders";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { 
  CreditCard, 
  Calendar, 
  User, 
  Package, 
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderDetailsModal = ({
  isOpen,
  onOpenChange,
  order,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCEEDED":
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "FAILED":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const statusDotColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCEEDED":
      case "COMPLETED":
        return "bg-emerald-500";
      case "PENDING":
        return "bg-amber-500";
      case "FAILED":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <DashboardModal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Order Details"
      maxWidth="sm:max-w-[600px]"
    >
      <div className="space-y-6 pb-2 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[60px] animate-bounce [animation-duration:10s]" />
        </div>

        {/* Header Stats */}
        <div className="relative group overflow-hidden bg-slate-950 rounded-2xl border border-white/10 shadow-xl p-8 text-white animate-in slide-in-from-left-8 fade-in duration-700 fill-mode-both">
          {/* Animated Background Highlights */}
          <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-indigo-500/10 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm backdrop-blur-md transition-all duration-300",
              getStatusStyle(order.status)
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", statusDotColor(order.status))} />
              {order.status === "SUCCEEDED" ? "Completed" : order.status}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter text-white drop-shadow-sm">
                ${Number(order.finalAmount || 0).toFixed(2)}
              </span>
              <div className="h-1 w-12 bg-indigo-500/30 rounded-full mt-4" />
            </div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
              Order Ref: <span className="text-slate-300 font-mono tracking-normal ml-1">#ORD-{String(order.id || "").slice(-6).toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Details Wrapper */}
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-4 animate-in slide-in-from-left-8 fade-in duration-700 delay-150 fill-mode-both">
              <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                <User className="h-3.5 w-3.5" /> Customer Info
              </h4>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md hover:border-slate-200 hover:bg-white transition-all duration-300 group">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-md font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-sm font-medium text-slate-500 truncate lowercase">{order.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="space-y-4 animate-in slide-in-from-left-8 fade-in duration-700 delay-300 fill-mode-both">
              <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                <Package className="h-3.5 w-3.5" /> Plan Details
              </h4>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md hover:border-slate-200 hover:bg-white transition-all duration-300 group">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Active Plan</p>
                  <Badge className={cn("mt-1 text-[9px] font-black px-3 py-1 border-none shadow-sm", 
                     order.plan?.name === "Silver" ? "bg-blue-600 shadow-blue-200" : order.plan?.name === "Gold" ? "bg-indigo-600 shadow-indigo-200" : "bg-purple-600 shadow-purple-200"
                  )}>
                    {order.plan?.name}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Currency</p>
                  <p className="text-md font-black text-blue-600">{String(order.currency || "USD").toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-4 animate-in slide-in-from-left-8 fade-in duration-700 delay-500 fill-mode-both">
            <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              <CreditCard className="h-3.5 w-3.5" /> Financial breakdown
            </h4>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-8 shadow-sm space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Original Price</span>
                <span className="text-slate-900 font-black tracking-tight">${Number(order.originalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Discount Applied</span>
                <span className="text-rose-500 font-black tracking-tight">-${Number(order.discountAmount || 0).toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-100/80" />
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-black text-md">Grand Total</span>
                <span className="text-3xl font-black text-slate-950 tracking-tighter">${Number(order.finalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 flex flex-col gap-6 animate-in slide-in-from-left-8 fade-in duration-700 delay-600 fill-mode-both">
            <div className="flex items-start gap-5">
               <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Calendar className="h-4 w-4 text-slate-400" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Processed At</span>
                  <span className="text-sm font-black text-slate-900">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-[12px] font-medium text-slate-500 opacity-70">
                    at {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
               </div>
            </div>

            <div className="flex items-start gap-5">
               <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Hash className="h-4 w-4 text-slate-400" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Tracking ID</span>
                  <span className="text-[12px] font-mono font-medium text-slate-500 break-all leading-relaxed bg-white/50 p-2 rounded-lg border border-slate-100/50 mt-1">
                    {order.id}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardModal>
  );
};
