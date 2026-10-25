"use client";

import React, { useState } from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { GroupData } from "./GroupCard";
import { useGetGroupQuery } from "@/lib/redux/features/groups/groupApi";

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: Partial<GroupData>) => Promise<void> | void;
  editingGroup: GroupData | null;
  isSaving?: boolean;
}

/** Canonical plan identifiers — must match backend GROUP_PLAN_KEYS */
const PLAN_OPTIONS = [
  {
    key: "PLUS",
    label: "ISO Brain Plus",
    description: "Plus-tier product access",
  },
  {
    key: "PRO",
    label: "ISO Brain Pro",
    description: "Pro-tier product access",
  },
  {
    key: "ULTRA",
    label: "ISO Brain Ultra",
    description: "Ultra-tier product access",
  },
] as const;

export function GroupModal({
  open,
  onOpenChange,
  onSave,
  editingGroup,
  isSaving = false,
}: GroupModalProps) {
  const [formData, setFormData] = useState<Partial<GroupData>>(
    editingGroup || {
      name: "",
      description: "",
      permissions: [],
      status: "ACTIVE",
      totalMembers: 0,
    },
  );
  const [error, setError] = useState<string | null>(null);

  const { data: fetchedGroup, isFetching } = useGetGroupQuery(
    editingGroup?.id as string,
    {
      skip: !editingGroup?.id || !open,
    },
  );

  React.useEffect(() => {
    if (fetchedGroup?.data) {
      setFormData({
        ...fetchedGroup.data,
        permissions: fetchedGroup.data.permissions || [],
      });
    } else if (!editingGroup && open) {
      setFormData({
        name: "",
        description: "",
        permissions: [],
        status: "ACTIVE",
        totalMembers: 0,
      });
    } else if (editingGroup && open) {
      setFormData(editingGroup);
    }
    setError(null);
  }, [fetchedGroup, editingGroup, open]);

  const togglePlan = (planKey: string) => {
    setFormData((prev) => {
      const current = prev.permissions || [];
      if (current.includes(planKey)) {
        return {
          ...prev,
          permissions: current.filter((p) => p !== planKey),
        };
      }
      return { ...prev, permissions: [...current, planKey] };
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (formData.name || "").trim();
    const permissions = formData.permissions || [];

    if (!name) {
      setError("Group name is required.");
      return;
    }
    if (permissions.length === 0) {
      setError("Select at least one plan (Plus, Pro, or Ultra).");
      return;
    }

    await onSave({
      ...formData,
      name,
      description: (formData.description || "").trim(),
      permissions,
    });
  };

  const busy = isFetching || isSaving;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={editingGroup ? "Edit User Group" : "Create User Group"}
      maxWidth="sm:max-w-[550px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]"
            >
              Group Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Event Attendees - September 2026"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)]"
              required
              disabled={busy}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]"
            >
              Description{" "}
              <span className="font-medium text-[var(--ib-mute)]">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Optional notes about this group…"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[80px] bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)]"
              disabled={busy}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Plan Access
            </Label>
            <p className="text-[13px] text-[var(--ib-mute)]">
              Members of this group receive access to the selected ISO Brain
              plans. Access is additive with any normal subscription.
            </p>
            <div className="space-y-2">
              {PLAN_OPTIONS.map((plan) => {
                const isSelected = formData.permissions?.includes(plan.key);
                return (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => togglePlan(plan.key)}
                    disabled={busy}
                    className={cn(
                      "w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all",
                      isSelected
                        ? "border-[var(--ib-acc)] bg-[var(--ib-accbg)] dark:bg-[var(--ib-acc)]/20"
                        : "border-[var(--ib-line)] dark:border-[var(--ib-line)] bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 hover:border-[var(--ib-line)]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px] font-bold",
                        isSelected
                          ? "border-[var(--ib-acc)] bg-[var(--ib-acc)] text-white"
                          : "border-[var(--ib-line)] dark:border-[var(--ib-line)] text-transparent",
                      )}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold text-[var(--ib-ink)] dark:text-white">
                        {plan.label}
                      </span>
                      <span className="block text-[12px] text-[var(--ib-mute)]">
                        {plan.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12"
            variant="primary"
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSaving ? "Saving…" : "Loading…"}
              </>
            ) : editingGroup ? (
              "Save Changes"
            ) : (
              "Create Group"
            )}
          </Button>
        </div>
      </form>
    </DashboardModal>
  );
}
