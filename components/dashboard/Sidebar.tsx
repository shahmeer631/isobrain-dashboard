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

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const adminGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ icon: Home, label: "Home", href: "/admin" }],
  },
  {
    label: "PRODUCTS",
    items: [
      { icon: GraduationCap, label: "Courses", href: "/admin/courses" },
      { icon: BookOpen, label: "ISO Standards", href: "/admin/iso-standards" },
      { icon: Package, label: "Bundles", href: "/admin/bundles" },
      { icon: LayoutList, label: "Categories", href: "/admin/categories" },
      { icon: Video, label: "Video Library", href: "/admin/video-library" },
      { icon: FileText, label: "Document Library", href: "/admin/document-library" },
    ],
  },
  {
    label: "COMMUNITY",
    items: [{ icon: User, label: "Communities", href: "/admin/community" }],
  },
  {
    label: "MARKETING",
    items: [
      { icon: DollarSign, label: "Affiliate Program", href: "/admin/affiliate-program" },
    ],
  },
  {
    label: "SUBSCRIPTIONS",
    items: [
      { icon: CreditCard, label: "Plans", href: "/admin/plans" },
      { icon: BsLightning, label: "Usage Units", href: "/admin/usage-units" },
      { icon: TbReceiptDollar, label: "Transactions", href: "/admin/transactions" },
    ],
  },
  {
    label: "SALES",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
      { icon: Gift, label: "Coupons & Discounts", href: "/admin/coupon-discount" },
    ],
  },
  {
    label: "USERS & GROUPS",
    items: [
      { icon: Users, label: "User Management", href: "/admin/users" },
      { icon: Folder, label: "User Groups", href: "/admin/groups" },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [{ icon: Award, label: "Certificates", href: "/admin/certificates" }],
  },
  {
    label: "ANALYTICS",
    items: [
      { icon: ChartColumn, label: "Analytics & Reports", href: "/admin/analytics-reports" },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ icon: Settings, label: "Settings", href: "/admin/setting" }],
  },
];

const userLearnItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/user" },
  { icon: GraduationCap, label: "My Courses", href: "/user/courses" },
  { icon: TrendingUp, label: "Progress", href: "/user/progress" },
  { icon: Award, label: "Certificates", href: "/user/certificates" },
];

const userAccountItems: NavItem[] = [
  { icon: User, label: "Profile", href: "/user/profile" },
  { icon: Settings, label: "Settings", href: "/user/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isCollapsed, toggleCollapse, isMobile } = useDashboard();

  const isAdmin = pathname.startsWith("/admin");
  const collapsed = isCollapsed && !isMobile;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(adminGroups.map((g) => [g.label, true]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
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
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="ml-2 border-transparent bg-[var(--ib-ink)] text-xs font-medium text-[var(--ib-on)]"
          >
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkEl;
  };

  return (
    <div
      className={cn(
        "relative z-50 flex h-full flex-col border-r border-[var(--ib-line)] bg-[var(--ib-side)] text-[var(--ib-ink)] transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[240px]",
        className
      )}
    >
      {!isMobile && (
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 rounded-full border border-[var(--ib-line)] bg-[var(--ib-card)] p-0 text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-ink)] min-[981px]:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
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
              const isOpen = openGroups[group.label] ?? true;
              const hasActiveItem = group.items.some((i) => isItemActive(i.href));

              return (
                <div key={group.label} className="mb-1">
                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-1 pt-4 pb-1.5 text-[10px] font-bold tracking-widest uppercase select-none cursor-pointer transition-colors",
                        hasActiveItem
                          ? "text-[var(--ib-acc)]"
                          : "text-[var(--ib-mute)] hover:text-[var(--ib-ink)]"
                      )}
                    >
                      <span>{group.label}</span>
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
              {!collapsed && <div className="ib-nav-label">Learn</div>}
              <div className="flex flex-col gap-0.5 mb-1">
                {userLearnItems.map((item) => (
                  <NavLink key={item.href} item={item} variant="user" />
                ))}
              </div>
              {!collapsed && (
                <div className="ib-nav-label" style={{ marginTop: 14 }}>
                  Account
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
                aria-label="Log out"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2 text-xs font-medium">
              Log out
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium text-[var(--ib-mute)] transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Log out</span>
          </button>
        )}

        <LogoutConfirmationModal
          open={showLogoutModal}
          onOpenChange={setShowLogoutModal}
          onConfirm={() => {
            dispatch(logout());
            router.push("/login");
            setShowLogoutModal(false);
          }}
        />
      </div>
    </div>
  );
}
