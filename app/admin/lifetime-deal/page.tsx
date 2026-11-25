"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Save } from "lucide-react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetLtdAdminAuditQuery,
  useGetLtdAdminConfigQuery,
  useGetLtdAdminPurchasesQuery,
  useUpdateLtdAdminScheduleMutation,
} from "@/lib/redux/api/lifetimeDealAdminApi";

function toLocalInputValue(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

function fromLocalInputValue(value: string): string {
  // Treat datetime-local as UTC wall clock for admin schedule editing
  if (!value) return new Date().toISOString();
  const iso = value.length === 16 ? `${value}:00.000Z` : `${value}.000Z`;
  return new Date(iso).toISOString();
}

const LifetimeDealAdminPage = () => {
  const {
    data: configRes,
    isLoading: configLoading,
    isError: configError,
    error: configQueryError,
    refetch: refetchConfig,
  } = useGetLtdAdminConfigQuery();
  const {
    data: purchasesRes,
    isLoading: purchasesLoading,
    refetch: refetchPurchases,
  } = useGetLtdAdminPurchasesQuery({ limit: 50 });
  const { data: auditRes } = useGetLtdAdminAuditQuery();
  const [updateSchedule, { isLoading: saving }] =
    useUpdateLtdAdminScheduleMutation();

  const config = configRes?.data;
  const purchases = purchasesRes?.data?.purchases ?? [];
  const logs = auditRes?.data?.logs ?? [];

  const [name, setName] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    if (!config) return;
    setName(config.name);
    setIsEnabled(config.isEnabled);
    setStartsAt(toLocalInputValue(config.startsAt));
    setEndsAt(toLocalInputValue(config.endsAt));
  }, [config]);

  const statusTone = useMemo(() => {
    switch (config?.status) {
      case "ACTIVE":
        return "text-emerald-600";
      case "SCHEDULED":
        return "text-amber-600";
      case "EXPIRED":
        return "text-rose-600";
      default:
        return "text-[var(--ib-mute)]";
    }
  }, [config?.status]);

  const handleSave = async () => {
    if (!config) return;
    try {
      await updateSchedule({
        promotionId: config.promotionId,
        name: name.trim() || config.name,
        isEnabled,
        startsAt: fromLocalInputValue(startsAt),
        endsAt: fromLocalInputValue(endsAt),
      }).unwrap();
      toast.success("Lifetime Deal schedule updated");
      void refetchConfig();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update schedule");
    }
  };

  return (
    <Container>
      <div className="flex w-full min-w-0 max-w-full flex-col gap-8">
        <PageHeader
          title="Lifetime Deal"
          subtitle="Manage the 7-day LTD window. Prices are view-only and locked server-side."
          actions={
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 shrink-0"
              onClick={() => {
                void refetchConfig();
                void refetchPurchases();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          }
        />

        {configLoading ? (
          <Skeleton className="h-[320px] w-full rounded-2xl" />
        ) : configError || !config ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
            <p className="font-bold text-rose-500">
              {(configQueryError as { data?: { message?: string } })?.data
                ?.message ||
                "Failed to load LTD configuration. Check that the API is running and try Refresh."}
            </p>
          </div>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="ib-card min-w-0 space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[16px] font-semibold text-[var(--ib-ink)]">
                    Promotion schedule
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
                    Status uses backend UTC — not the browser clock.
                  </p>
                </div>
                <span className={`text-[13px] font-bold uppercase tracking-wide ${statusTone}`}>
                  {config.status}
                </span>
              </div>

              <label className="block min-w-0 space-y-1.5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full min-w-0 max-w-full rounded-xl border border-[var(--ib-line)] bg-[var(--ib-bg)] px-3 text-[14px] text-[var(--ib-ink)]"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[var(--ib-line)] px-4 py-3">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="size-4 shrink-0"
                />
                <span className="text-[14px] font-medium text-[var(--ib-ink)]">
                  Promotion enabled
                </span>
              </label>

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block min-w-0 space-y-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                    Starts at (UTC)
                  </span>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="h-11 w-full min-w-0 max-w-full rounded-xl border border-[var(--ib-line)] bg-[var(--ib-bg)] px-3 text-[14px] text-[var(--ib-ink)]"
                  />
                </label>
                <label className="block min-w-0 space-y-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                    Ends at (UTC)
                  </span>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="h-11 w-full min-w-0 max-w-full rounded-xl border border-[var(--ib-line)] bg-[var(--ib-bg)] px-3 text-[14px] text-[var(--ib-ink)]"
                  />
                </label>
              </div>

              <Button
                type="button"
                variant="primary"
                className="h-11 gap-2"
                disabled={saving || !config.canManageSchedule}
                onClick={() => void handleSave()}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save schedule
              </Button>
            </section>

            <section className="ib-card min-w-0 space-y-4 p-5 sm:p-6">
              <h2 className="text-[16px] font-semibold text-[var(--ib-ink)]">
                Review (read-only)
              </h2>
              <dl className="space-y-3 text-[14px]">
                <div className="flex items-start justify-between gap-3 border-b border-[var(--ib-line)] pb-2">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Promotion ID</dt>
                  <dd className="min-w-0 break-all text-right font-medium text-[var(--ib-ink)]">
                    {config.promotionId}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--ib-line)] pb-2">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Currency</dt>
                  <dd className="font-medium uppercase text-[var(--ib-ink)]">
                    {config.currency}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--ib-line)] pb-2">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Plus LTD</dt>
                  <dd className="font-medium text-[var(--ib-ink)]">
                    ${config.prices.plus}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--ib-line)] pb-2">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Pro LTD</dt>
                  <dd className="font-medium text-[var(--ib-ink)]">
                    ${config.prices.pro}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--ib-line)] pb-2">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Ultra LTD</dt>
                  <dd className="font-medium text-[var(--ib-ink)]">
                    ${config.prices.ultra}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-[var(--ib-mute)]">Price edits</dt>
                  <dd className="font-medium text-rose-600">
                    {config.canAlterPrices ? "Allowed" : "Locked"}
                  </dd>
                </div>
              </dl>
              <p className="text-[12px] leading-relaxed break-words text-[var(--ib-mute)]">
                Annual restore anchors: Plus ${config.standardAnnualPrices.plus}{" "}
                / Pro ${config.standardAnnualPrices.pro} / Ultra $
                {config.standardAnnualPrices.ultra} per year. No Stripe secrets
                are shown here.
              </p>
            </section>
          </div>
        )}

        <section className="ib-card overflow-hidden">
          <div className="border-b border-[var(--ib-line)] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[var(--ib-ink)]">
              LTD purchases
            </h2>
            <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
              {purchasesRes?.data?.total ?? 0} total · emails shown for
              authorized admin views only
            </p>
          </div>
          {purchasesLoading ? (
            <div className="p-6">
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[13px]">
                <thead className="bg-[var(--ib-bg)] text-[11px] uppercase tracking-wide text-[var(--ib-mute)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Tier</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Purchased</th>
                    <th className="px-4 py-3 font-semibold">Stripe ref</th>
                    <th className="px-4 py-3 font-semibold">Entitlement</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-[var(--ib-mute)]"
                      >
                        No lifetime purchases yet.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-[var(--ib-line)] text-[var(--ib-ink)]"
                      >
                        <td className="px-4 py-3">{p.userName || p.userId}</td>
                        <td className="px-4 py-3">{p.userEmail || "—"}</td>
                        <td className="px-4 py-3 font-medium">{p.tier}</td>
                        <td className="px-4 py-3">
                          ${p.amount} {p.currency.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">{p.paymentStatus}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {p.purchasedAt
                            ? `${new Date(p.purchasedAt).toISOString().slice(0, 19)}Z`
                            : "—"}
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3 font-mono text-[11px]">
                          {p.stripeReference || "—"}
                        </td>
                        <td className="px-4 py-3">{p.entitlementStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ib-card overflow-hidden">
          <div className="border-b border-[var(--ib-line)] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[var(--ib-ink)]">
              Configuration audit
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-[var(--ib-bg)] text-[11px] uppercase tracking-wide text-[var(--ib-mute)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">When (UTC)</th>
                  <th className="px-4 py-3 font-semibold">Admin</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-[var(--ib-mute)]"
                    >
                      No audit entries yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-[var(--ib-line)] text-[var(--ib-ink)]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(log.createdAt).toISOString().slice(0, 19)}Z
                      </td>
                      <td className="px-4 py-3">
                        {log.adminEmail || log.adminUserId}
                      </td>
                      <td className="px-4 py-3 font-medium">{log.action}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default LifetimeDealAdminPage;
