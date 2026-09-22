import React from "react";
import { FileText, Video, Download } from "lucide-react";
import { IRecentResource } from "@/types/userDashboardTypes";
import { RecentResourcesSkeleton } from "./UserDashboardSkeleton";

const getResourceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) {
    return { icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10" };
  }
  if (t.includes("video")) {
    return { icon: Video, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/10" };
  }
  if (t.includes("manual") || t.includes("doc")) {
    return { icon: FileText, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10" };
  }
  if (t.includes("checklist")) {
    return { icon: FileText, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10" };
  }
  return { icon: FileText, color: "text-slate-600 bg-slate-50 dark:bg-slate-900/10" };
};

interface RecentResourcesProps {
  resources?: IRecentResource[];
  isLoading?: boolean;
}

export function RecentResources({ resources = [], isLoading }: RecentResourcesProps) {
  if (isLoading) {
    return <RecentResourcesSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
          Recent Resources
        </h3>
      </div>

      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recent resources found</p>
          </div>
        ) : (
          resources.map((resource) => {
            const { icon: Icon, color } = getResourceIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 group"
              >
                <div
                  className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                    {resource.title}
                  </h4>
                  <p className="text-[12px] font-medium text-slate-500">
                    {resource.type} • {resource.size}
                  </p>
                </div>

                <button className="h-9 w-9 hidden items-center justify-center rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
