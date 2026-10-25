import React from "react";
import { FileText, Video, Download } from "lucide-react";
import { IRecentResource } from "@/types/userDashboardTypes";
import { RecentResourcesSkeleton } from "./UserDashboardSkeleton";

const getResourceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) {
    return { icon: FileText, color: "text-[var(--ib-acc)] bg-[var(--ib-accbg)]" };
  }
  if (t.includes("video")) {
    return { icon: Video, color: "text-[var(--ib-acc)] bg-[var(--ib-accbg)]" };
  }
  if (t.includes("manual") || t.includes("doc")) {
    return { icon: FileText, color: "text-[var(--ib-acc)] bg-[var(--ib-accbg)]" };
  }
  if (t.includes("checklist")) {
    return { icon: FileText, color: "text-[var(--ib-ok)] bg-[var(--ib-okbg)]" };
  }
  return { icon: FileText, color: "text-[var(--ib-mute)] bg-[var(--ib-bg)]" };
};

interface RecentResourcesProps {
  resources?: IRecentResource[];
  isLoading?: boolean;
}

export function RecentResources({
  resources = [],
  isLoading,
}: RecentResourcesProps) {
  if (isLoading) {
    return <RecentResourcesSkeleton />;
  }

  return (
    <div className="ib-card h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Recent Resources
        </h2>
      </div>

      <div className="space-y-2.5">
        {resources.length === 0 ? (
          <div className="py-10 text-center text-[var(--ib-mute)]">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-20" />
            <p className="text-sm">No recent resources found</p>
          </div>
        ) : (
          resources.map((resource, index) => {
            const { icon: Icon, color } = getResourceIcon(resource.type || "");
            const key =
              resource.id != null && String(resource.id) !== ""
                ? String(resource.id)
                : `resource-${index}-${resource.title || "item"}`;
            return (
              <div
                key={key}
                className="group flex items-center gap-3.5 rounded-[10px] border border-transparent bg-[var(--ib-bg)]/60 p-3.5 transition-all hover:border-[var(--ib-line)] hover:bg-[var(--ib-card)]"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] ${color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[14px] font-semibold text-[var(--ib-ink)]">
                    {resource.title}
                  </h4>
                  <p className="text-[12px] text-[var(--ib-mute)]">
                    {resource.type} • {resource.size}
                  </p>
                </div>

                {resource.url ? (
                  <a
                    href={resource.url}
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] text-[var(--ib-mute)] transition-all hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-acc)]"
                    aria-label={`Download ${resource.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="h-9 w-9" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
