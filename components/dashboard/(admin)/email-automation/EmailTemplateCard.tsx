"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Eye, Copy } from "lucide-react";

interface EmailTemplateCardProps {
  name: string;
  description: string;
  subject: string;
  status: "Active" | "Inactive";
  stats: {
    sent: string;
    openRate: string;
    clickRate: string;
  };
  onEdit?: () => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
}

export function EmailTemplateCard({
  name,
  description,
  subject,
  status,
  stats,
  onEdit,
  onPreview,
  onDuplicate,
}: EmailTemplateCardProps) {
  return (
    <Card className="p-6 overflow-hidden border-[var(--ib-line)] dark:border-[var(--ib-line)] hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--ib-ink)] dark:text-white leading-tight">
                {name}
              </h3>
              {status === "Active" && (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] h-5 px-2">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8 gap-1.5 text-xs border-[var(--ib-line)] dark:border-[var(--ib-line)]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="h-8 gap-1.5 text-xs border-[var(--ib-line)] dark:border-[var(--ib-line)]"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              className="h-8 gap-1.5 text-xs border-[var(--ib-line)] dark:border-[var(--ib-line)]"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </Button>
          </div>
        </div>

        {/* Subject Line */}
        <div className="rounded-lg bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 p-3 flex items-center gap-3">
          <span className="text-xs font-medium text-[var(--ib-mute)] dark:text-[var(--ib-mute)] shrink-0">
            Subject:
          </span>
          <span className="text-sm text-[var(--ib-ink)] dark:text-[var(--ib-mute)] truncate font-medium">
            {subject}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8 pt-2 border-t border-[var(--ib-line)] dark:border-[var(--ib-line)]/50">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-[var(--ib-mute)] dark:text-[var(--ib-mute)] uppercase tracking-wider">
              Emails Sent
            </p>
            <p className="text-xl font-bold text-[var(--ib-ink)] dark:text-white">
              {stats.sent}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-[var(--ib-mute)] dark:text-[var(--ib-mute)] uppercase tracking-wider">
              Open Rate
            </p>
            <p className="text-xl font-bold text-emerald-500">
              {stats.openRate}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-[var(--ib-mute)] dark:text-[var(--ib-mute)] uppercase tracking-wider">
              Click Rate
            </p>
            <p className="text-xl font-bold text-blue-500">{stats.clickRate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
