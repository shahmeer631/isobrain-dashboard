"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ITransaction } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { useState } from "react";

interface TransactionTableProps {
  transactions: ITransaction[];
  isLoading?: boolean;
}

export const TransactionTable = React.memo(({ transactions, isLoading }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (tx: ITransaction) => {
    setSelectedTransaction(tx);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCEEDED":
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "FAILED":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-[var(--ib-bg)] text-[var(--ib-mute)] border-[var(--ib-line)]";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status.toUpperCase() === "SUCCEEDED") return "Completed";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className={cn("bg-white rounded-xl border border-[var(--ib-line)] overflow-hidden", isLoading && "opacity-60 pointer-events-none")}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[var(--ib-line)]">
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Transaction ID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">User</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Plan</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Amount</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Units</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Payment</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Date</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight">Status</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[var(--ib-mute)] uppercase tracking-tight text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ib-line)]">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[var(--ib-bg)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-[var(--ib-bg)] text-[var(--ib-mute)] px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--ib-line)]">
                      TXN-{tx.id.slice(-4).toUpperCase()}-{tx.id.slice(0, 4).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--ib-ink)]">{tx.user.firstName} {tx.user.lastName}</span>
                      <span className="text-[12px] font-medium text-[var(--ib-mute)]">{tx.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn("text-[10px] font-bold px-2.5 py-1 border-none", 
                      tx.plan.name === "Silver" ? "bg-blue-600" : tx.plan.name === "Gold" ? "bg-[var(--ib-acc)]" : "bg-[var(--ib-acc)]"
                    )}>
                      {tx.plan.name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-emerald-600">${tx.finalAmount}</span>
                      {tx.discountAmount > 0 && (
                        <>
                          <span className="text-[11px] font-medium text-[var(--ib-mute)] line-through">${tx.originalAmount}</span>
                          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-tight">Save ${tx.discountAmount}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600">{tx.plan.learningUnits}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--ib-mute)]">
                    {tx.stripePaymentIntentId ? "Stripe" : "Card"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--ib-mute)]">
                    {new Date(tx.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn("text-[10px] font-bold px-3 py-1 border rounded-lg", getStatusStyle(tx.status))}>
                      {getStatusLabel(tx.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-lg border border-[var(--ib-line)] text-[var(--ib-mute)] hover:text-[var(--ib-mute)]"
                      onClick={() => handleShowDetails(tx)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-[var(--ib-mute)] font-medium">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TransactionDetailsModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
});

TransactionTable.displayName = "TransactionTable";
