import React from "react";
import { ChevronRight, Award, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRecentAchievement } from "@/types/userDashboardTypes";
import { RecentAchievementsSkeleton } from "./UserDashboardSkeleton";

const getAchievementStyle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("course")) {
    return { icon: CheckCircle, color: "bg-amber-500 text-white shadow-amber-500/20" };
  }
  if (t.includes("iso") || t.includes("cert")) {
    return { icon: Award, color: "bg-orange-500 text-white shadow-orange-500/20" };
  }
  return { icon: TrendingUp, color: "bg-indigo-600 text-white shadow-indigo-600/20" };
};

interface RecentAchievementsProps {
  achievements?: IRecentAchievement[];
  isLoading?: boolean;
}

export function RecentAchievements({ achievements = [], isLoading }: RecentAchievementsProps) {
  if (isLoading) {
    return <RecentAchievementsSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
          Recent Achievements
        </h3>
        {/* <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 group transition-all"
        >
          View All{" "}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button> */}
      </div>

      <div className="space-y-6">
        {achievements.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recent achievements</p>
          </div>
        ) : (
          achievements.map((achievement) => {
            const { icon: Icon, color } = getAchievementStyle(achievement.title);
            return (
              <div
                key={achievement.id}
                className="flex items-center gap-5 relative group"
              >
                <div
                  className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h4 className="text-[15px] font-black text-slate-900 dark:text-white leading-tight">
                    {achievement.title}
                  </h4>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                    {achievement.date}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
