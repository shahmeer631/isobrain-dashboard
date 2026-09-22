
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  className?: string
  trend?: "up" | "down"
  trendValue?: string
}

export function StatCard({ label, value, icon: Icon, className, trend, trendValue }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-xl group rounded-3xl", className)}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-7 w-7" />
          </div>
          {trend && (
             <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50", trend === 'up' ? 'text-emerald-500' : 'text-rose-500')}>
               {trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
               {trendValue || '12%'}
             </div>
          )}
        </div>
        
        <div className="mt-8 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <h3 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}
