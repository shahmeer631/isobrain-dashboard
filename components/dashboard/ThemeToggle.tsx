"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared Light / Dark toggle for Student and Admin dashboards.
 * Uses next-themes + `isobrain-dashboard-theme` storage (see app/layout.tsx).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-[9px] border border-[var(--ib-line)] text-[var(--ib-mute)]",
          className
        )}
        aria-label="Toggle color theme"
        disabled
      >
        <Sun className="h-4 w-4" aria-hidden />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-9 w-9 rounded-[9px] border border-[var(--ib-line)] text-[var(--ib-mute)] transition-colors hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-acc)] focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)]/30",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
