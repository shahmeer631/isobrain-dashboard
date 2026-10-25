"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  collapsed?: boolean;
  /** Kept for call-site compatibility; branding is theme-token driven. */
  variant?: "user" | "admin";
  className?: string;
};

/**
 * ISOBrain.AI mark for the dashboard sidebar.
 * Uses the brand squircle (white brain on accent blue) so the mark
 * is never clipped by a conflicting background or black PNG fill.
 */
export function BrandLogo({
  href = "/user",
  collapsed = false,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ib-side)]",
        collapsed ? "justify-center" : "px-1",
        className
      )}
      aria-label="ISOBrain.AI home"
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[9px]",
          "shadow-[0_1px_2px_rgba(14,20,36,0.08)]",
          collapsed ? "size-9" : "size-8"
        )}
      >
        <Image
          src="/brand-mark.png"
          alt=""
          width={36}
          height={36}
          className="size-full object-cover object-center"
          priority
        />
      </span>
      {!collapsed && (
        <span className="truncate text-[15px] font-bold leading-none tracking-[-0.02em] text-[var(--ib-ink)]">
          ISOBrain
          <span className="text-[var(--ib-acc)]">.AI</span>
        </span>
      )}
    </Link>
  );
}
