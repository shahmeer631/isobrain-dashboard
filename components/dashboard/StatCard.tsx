
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
    <Card className={cn("overflow-hidden border border-[var(--ib-line)] bg-[var(--ib-card)] shadow-sm transition-all duration-500 hover:shadow-md group rounded-2xl", className)}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ib-acc)] text-white transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-7 w-7" />
          </div>
          {trend && (
             <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--ib-bg)]", trend === 'up' ? 'text-[var(--ib-ok)]' : 'text-rose-500')}>
               {trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
               {trendValue || '12%'}
             </div>
          )}
        </div>
        
        <div className="mt-8 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ib-mute)]">
            {label}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-[var(--ib-ink)]">
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}
