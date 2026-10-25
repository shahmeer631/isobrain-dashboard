import React from "react";
import { Award, TrendingUp, CheckCircle } from "lucide-react";
import { IRecentAchievement } from "@/types/userDashboardTypes";
import { RecentAchievementsSkeleton } from "./UserDashboardSkeleton";

const getAchievementStyle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("course")) {
    return {
      icon: CheckCircle,
      color: "bg-[var(--ib-acc)] text-[var(--ib-on)]",
    };
  }
  if (t.includes("iso") || t.includes("cert")) {
    return {
      icon: Award,
      color: "bg-[var(--ib-ok)] text-white",
    };
  }
  return { icon: TrendingUp, color: "bg-[var(--ib-acc)] text-[var(--ib-on)]" };
};

interface RecentAchievementsProps {
  achievements?: IRecentAchievement[];
  isLoading?: boolean;
}

export function RecentAchievements({
  achievements = [],
  isLoading,
}: RecentAchievementsProps) {
  if (isLoading) {
    return <RecentAchievementsSkeleton />;
  }

  return (
    <div className="ib-card h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Recent Achievements
        </h2>
      </div>

      <div className="space-y-4">
        {achievements.length === 0 ? (
          <div className="py-10 text-center text-[var(--ib-mute)]">
            <Award className="mx-auto mb-3 h-10 w-10 opacity-20" />
            <p className="text-sm">No recent achievements</p>
          </div>
        ) : (
          achievements.map((achievement, index) => {
            const { icon: Icon, color } = getAchievementStyle(achievement.title);
            const key =
              achievement.id != null && String(achievement.id) !== ""
                ? String(achievement.id)
                : `achievement-${index}-${achievement.title || "item"}`;
            return (
              <div
                key={key}
                className="group flex items-center gap-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[14px] font-semibold text-[var(--ib-ink)]">
                    {achievement.title}
                  </h4>
                  <p className="mt-0.5 text-[12px] text-[var(--ib-mute)]">
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
