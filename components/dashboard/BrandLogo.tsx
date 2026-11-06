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
 * Uses the same /isobrain-logo.png asset as the main website.
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
        "group flex items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ib-side)]",
        collapsed ? "justify-center" : "px-0.5",
        className
      )}
      aria-label="ISOBrain.AI home"
    >
      <Image
        src="/isobrain-logo.png"
        alt="ISOBrain.AI"
        width={collapsed ? 48 : 220}
        height={collapsed ? 48 : 220}
        className={cn(
          "object-contain object-center",
          collapsed ? "size-11 rounded-lg" : "h-[84px] w-auto max-w-full rounded-[12px]"
        )}
        priority
      />
    </Link>
  );
}
