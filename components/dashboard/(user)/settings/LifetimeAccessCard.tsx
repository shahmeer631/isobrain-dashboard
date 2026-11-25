"use client";

import React from "react";
import { BadgeCheck, Infinity, Receipt } from "lucide-react";
import {
  useGetBillingOverviewQuery,
  type BillingOverview,
} from "@/lib/redux/api/userApi";

type LifetimeAccessData = NonNullable<
  BillingOverview["data"]["lifetimeAccess"]
>;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LifetimeAccessCard() {
  const { data, isLoading, isError } = useGetBillingOverviewQuery();
  const lifetime = data?.data?.lifetimeAccess as LifetimeAccessData | null | undefined;
  const purchases = data?.data?.lifetimePurchases || [];

  if (isLoading) {
    return (
      <div className="ib-card h-40 animate-pulse p-6 sm:p-7" aria-hidden />
    );
  }

  if (isError) {
    return null;
  }

  if (!lifetime && purchases.length === 0) {
    return null;
  }

  return (
    <div className="ib-card p-6 sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--ib-acc)_16%,var(--ib-line))] bg-[var(--ib-accbg)] text-[var(--ib-acc)]">
          <Infinity className="size-4" aria-hidden />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
            Lifetime Access
          </h2>
          <p className="mt-0.5 text-[13px] text-[var(--ib-mute)]">
            One-time lifetime purchases are separate from annual subscriptions.
          </p>
        </div>
      </div>

      {lifetime ? (
        <div className="rounded-[12px] border border-[color-mix(in_srgb,var(--ib-acc)_35%,var(--ib-line))] bg-[var(--ib-accbg)]/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-[var(--ib-acc)]" aria-hidden />
              <div>
                <p className="text-sm font-bold text-[var(--ib-ink)]">
                  ISOBrain {lifetime.tier}
                </p>
                <p className="text-xs text-[var(--ib-mute)]">
                  Permanent access · {lifetime.planName || "Lifetime"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Lifetime
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                Status
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--ib-ink)]">
                {lifetime.status}
                {lifetime.isPermanent ? " · Never expires" : ""}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                Purchase date
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--ib-ink)]">
                {formatDate(lifetime.purchasedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                Amount
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--ib-ink)]">
                ${Number(lifetime.amount).toFixed(2)}{" "}
                {String(lifetime.currency || "usd").toUpperCase()}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ib-mute)]">
                Receipt / payment ref
              </dt>
              <dd className="mt-0.5 flex items-start gap-1.5 break-all text-sm font-medium text-[var(--ib-ink)]">
                <Receipt className="mt-0.5 size-3.5 shrink-0 text-[var(--ib-mute)]" aria-hidden />
                {lifetime.receiptRef}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="text-sm text-[var(--ib-mute)]">
          No active lifetime entitlement yet. Successful LTD payments appear here after
          activation.
        </p>
      )}

      {purchases.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-2 text-[13px] font-semibold text-[var(--ib-ink)]">
            Lifetime purchase history
          </h3>
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--ib-line)] bg-[var(--ib-bg)] px-3 py-2.5 text-[13px]"
              >
                <span className="font-medium text-[var(--ib-ink)]">
                  {p.tier} · ${Number(p.amount).toFixed(2)}
                </span>
                <span className="text-[var(--ib-mute)]">
                  {formatDate(p.purchasedAt)} · {p.status}
                  {p.isActive ? " · Active" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
