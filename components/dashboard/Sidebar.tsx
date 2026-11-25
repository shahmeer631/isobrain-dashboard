"use client";

import { LogoutConfirmationModal } from "@/components/dashboard/LogoutConfirmationModal";
import { logout } from "@/lib/redux/features/auth/authSlice";
import {
  Award,
  BookOpen,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  Folder,
  Gift,
  GraduationCap,
  Home,
  LayoutList,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-context";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BsLightning } from "react-icons/bs";
import { TbReceiptDollar } from "react-icons/tb";
import { BrandLogo } from "@/components/dashboard/BrandLogo";
import { useTranslation } from "react-i18next";
import "@/lib/i18n/client";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

type NavItem = {
  icon: React.ElementType;
  labelKey: string;
  href: string;
};

type NavGroup = {
  labelKey: string;
  items: NavItem[];
};

const adminGroups: NavGroup[] = [
  {
    labelKey: "nav.overview",
    items: [{ icon: Home, labelKey: "nav.home", href: "/admin" }],
  },
  {
    labelKey: "nav.products",
    items: [
      { icon: GraduationCap, labelKey: "nav.courses", href: "/admin/courses" },
      { icon: BookOpen, labelKey: "nav.isoStandards", href: "/admin/iso-standards" },
      { icon: Package, labelKey: "nav.bundles", href: "/admin/bundles" },
      { icon: LayoutList, labelKey: "nav.categories", href: "/admin/categories" },
      { icon: Video, labelKey: "nav.videoLibrary", href: "/admin/video-library" },
      { icon: FileText, labelKey: "nav.documentLibrary", href: "/admin/document-library" },
    ],
  },
  {
    labelKey: "nav.community",
    items: [{ icon: User, labelKey: "nav.communities", href: "/admin/community" }],
  },
  {
    labelKey: "nav.marketing",
    items: [
      { icon: DollarSign, labelKey: "nav.affiliate", href: "/admin/affiliate-program" },
    ],
  },
  {
    labelKey: "nav.subscriptions",
    items: [
      { icon: CreditCard, labelKey: "nav.plans", href: "/admin/plans" },
      { icon: Gift, labelKey: "nav.lifetimeDeal", href: "/admin/lifetime-deal" },
      { icon: BsLightning, labelKey: "nav.usageUnits", href: "/admin/usage-units" },
      { icon: TbReceiptDollar, labelKey: "nav.transactions", href: "/admin/transactions" },
    ],
  },
  {
    labelKey: "nav.sales",
    items: [
      { icon: ShoppingCart, labelKey: "nav.orders", href: "/admin/orders" },
      { icon: Gift, labelKey: "nav.coupons", href: "/admin/coupon-discount" },
    ],
  },
  {
    labelKey: "nav.usersGroups",
    items: [
      { icon: Users, labelKey: "nav.userManagement", href: "/admin/users" },
      { icon: Folder, labelKey: "nav.userGroups", href: "/admin/groups" },
    ],
  },
  {
    labelKey: "nav.engagement",
    items: [{ icon: Award, labelKey: "nav.certificates", href: "/admin/certificates" }],
  },
  {
    labelKey: "nav.analytics",
    items: [
      { icon: ChartColumn, labelKey: "nav.analyticsReports", href: "/admin/analytics-reports" },
    ],
  },
  {
    labelKey: "nav.system",
    items: [{ icon: Settings, labelKey: "nav.settings", href: "/admin/setting" }],
  },
];

const userLearnItems: NavItem[] = [
  { icon: Home, labelKey: "nav.dashboard", href: "/user" },
  { icon: GraduationCap, labelKey: "nav.myCourses", href: "/user/courses" },
  { icon: TrendingUp, labelKey: "nav.progress", href: "/user/progress" },
  { icon: Award, labelKey: "nav.certificates", href: "/user/certificates" },
];

const userAccountItems: NavItem[] = [
  { icon: User, labelKey: "nav.profile", href: "/user/profile" },
  { icon: Settings, labelKey: "nav.settings", href: "/user/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isCollapsed, toggleCollapse, isMobile } = useDashboard();

  const isAdmin = pathname.startsWith("/admin");
  const collapsed = isCollapsed && !isMobile;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(adminGroups.map((g) => [g.labelKey, true]))
  );

  const toggleGroup = (labelKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [labelKey]: !prev[labelKey] }));
  };

  const isItemActive = (href: string) =>
    pathname === href ||
    (href !== "/admin" && href !== "/user" && pathname.startsWith(href));

  const NavLink = ({
    item,
    variant,
  }: {
    item: NavItem;
    variant: "admin" | "user";
  }) => {
    const active = isItemActive(item.href);

    const linkEl = (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-[background-color,color,box-shadow] duration-200",
          variant === "user" &&
            (active
              ? "bg-[var(--ib-accbg)] font-semibold text-[var(--ib-acc)] shadow-[inset_3px_0_0_0_var(--ib-acc)]"
              : "text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)]/70 hover:text-[var(--ib-ink)]"),
          // Admin keeps solid accent active state; inactive uses theme tokens
          // so Light Mode stays readable (no forced light-on-dark text).
          variant === "admin" &&
            (active
              ? "border-transparent bg-[var(--ib-acc)] font-semibold text-white shadow-sm"
              : "text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-ink)]"),
          collapsed ? "mx-auto h-11 w-11 justify-center px-0" : ""
        )}
      >
        <item.icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",
            variant === "user" &&
              (active ? "text-[var(--ib-acc)]" : "text-[var(--ib-mute)]"),
            variant === "admin" &&
              (active ? "text-white" : "text-[var(--ib-mute)]")
          )}
        />
        {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="ms-2 border-transparent bg-[var(--ib-ink)] text-xs font-medium text-[var(--ib-on)]"
          >
            {t(item.labelKey)}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkEl;
  };

  return (
    <div
      className={cn(
        "relative z-50 flex h-full flex-col border-e border-[var(--ib-line)] bg-[var(--ib-side)] text-[var(--ib-ink)] transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[240px]",
        className
      )}
    >
      {!isMobile && (
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="icon"
          className="absolute -end-3 top-20 z-10 hidden h-6 w-6 rounded-full border border-[var(--ib-line)] bg-[var(--ib-card)] p-0 text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-ink)] min-[981px]:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          ) : (
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          )}
        </Button>
      )}

      {/* Brand */}
      <div
        className={cn(
          "flex items-center px-3.5 pt-5 pb-4 transition-all duration-300",
          collapsed ? "justify-center px-2" : ""
        )}
      >
        <BrandLogo
          href={isAdmin ? "/admin" : "/user"}
          collapsed={collapsed}
          variant={isAdmin ? "admin" : "user"}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="flex flex-col px-3.5">
          {isAdmin &&
            adminGroups.map((group) => {
              const isOpen = openGroups[group.labelKey] ?? true;
              const hasActiveItem = group.items.some((i) => isItemActive(i.href));

              return (
                <div key={group.labelKey} className="mb-1">
                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.labelKey)}
                      className={cn(
                        "w-full flex items-center justify-between px-1 pt-4 pb-1.5 text-[10px] font-bold tracking-widest uppercase select-none cursor-pointer transition-colors",
                        hasActiveItem
                          ? "text-[var(--ib-acc)]"
                          : "text-[var(--ib-mute)] hover:text-[var(--ib-ink)]"
                      )}
                    >
                      <span>{t(group.labelKey)}</span>
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          isOpen ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </button>
                  )}
                  <div
                    className={cn(
                      "flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ease-in-out",
                      collapsed || isOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none"
                    )}
                  >
                    {group.items.map((item) => (
                      <NavLink key={item.href} item={item} variant="admin" />
                    ))}
                  </div>
                </div>
              );
            })}

          {!isAdmin && (
            <>
              {!collapsed && <div className="ib-nav-label">{t("nav.learn")}</div>}
              <div className="flex flex-col gap-0.5 mb-1">
                {userLearnItems.map((item) => (
                  <NavLink key={item.href} item={item} variant="user" />
                ))}
              </div>
              {!collapsed && (
                <div className="ib-nav-label" style={{ marginTop: 14 }}>
                  {t("nav.account")}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {userAccountItems.map((item) => (
                  <NavLink key={item.href} item={item} variant="user" />
                ))}
              </div>
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-[var(--ib-line)] p-3.5">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setShowLogoutModal(true)}
                className="mx-auto h-11 w-11 justify-center rounded-[9px] px-0 py-2 text-[var(--ib-mute)] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label={t("nav.logout")}
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ms-2 text-xs font-medium">
              {t("nav.logout")}
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium text-[var(--ib-mute)] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>{t("nav.logout")}</span>
          </button>
        )}

        <LogoutConfirmationModal
          open={showLogoutModal}
          onOpenChange={setShowLogoutModal}
          onConfirm={() => {
            dispatch(logout());
            setShowLogoutModal(false);
            router.replace("/login");
          }}
        />
      </div>
    </div>
  );
}
