import { Award, Calendar, Share2 } from "lucide-react";

import { UserCertificateStatsSkeleton } from "./UserCertificateSkeleton";

interface CertificateStatsProps {
  totalCertificates: number;
  thisMonth: number;
  profileViews: number;
  isLoading?: boolean;
}

export function CertificateStats({
  totalCertificates,
  thisMonth,
  profileViews,
  isLoading,
}: CertificateStatsProps) {
  if (isLoading) {
    return <UserCertificateStatsSkeleton />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Certificates (Hero Blue) */}
      <div className="bg-[#6B4BFF] hover:bg-[#5a3ae6] transition-colors duration-300 rounded-3xl p-8 flex flex-col justify-between text-white shadow-lg overflow-hidden relative group min-h-[140px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md mb-4 shadow-sm border border-white/10 shrink-0 relative z-10">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-4xl font-black tracking-tight leading-none mb-2">
            {totalCertificates}
          </p>
          <p className="text-xs font-bold opacity-90 uppercase tracking-widest text-indigo-50">
            Total Certificates
          </p>
        </div>
      </div>

      {/* This Month */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm min-h-[140px] hover:border-emerald-500/30 transition-colors duration-300">
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-4 shrink-0 border border-emerald-100 dark:border-emerald-800">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none mb-2">
            {thisMonth}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            This Month
          </p>
        </div>
      </div>

      {/* Profile Views */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm min-h-[140px] hover:border-purple-500/30 transition-colors duration-300">
        <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-4 shrink-0 border border-purple-100 dark:border-purple-800">
          <Share2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none mb-2">
            {profileViews}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Profile Views
          </p>
        </div>
      </div>
    </div>
  );
}
