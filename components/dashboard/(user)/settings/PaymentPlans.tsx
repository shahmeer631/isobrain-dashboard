import { Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PaymentPlans() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-5 w-5 text-slate-800 dark:text-slate-200" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Payment Plans & Subscriptions
        </h2>
      </div>

      <div className="space-y-4">
        {/* Active Subscription Plan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Learning Points - Starter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              500 points • Next billing: 2024-03-15
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-500">
              $49.00
            </span>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 font-semibold text-[10px] px-2 py-0"
            >
              Active
            </Badge>
          </div>
        </div>

        {/* Available Points Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Available Learning Points
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use learning points to access AI tools and generate documents
            </p>
            <Button size="sm" variant="primary" className="mt-4 gap-1.5 h-8 font-bold">
              <Zap className="h-3.5 w-3.5" />
              Buy More Points
            </Button>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
            1,245 points
          </div>
        </div>
      </div>
    </div>
  );
}
