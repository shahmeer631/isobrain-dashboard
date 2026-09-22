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
  Video
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { useDashboard } from "@/components/dashboard/dashboard-context";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BsLightning } from "react-icons/bs";
import { TbReceiptDollar } from "react-icons/tb";
import Image from "next/image";

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
      // { icon: Mail, label: "Email Automation", href: "/admin/email-automation" },
    ],
  },
  {
    label: "SUBSCRIPTIONS",
    items: [
      { icon: CreditCard, label: "Plans", href: "/admin/plans" },
      // { icon: Percent, label: "Discounts", href: "/admin/discounts" },
      { icon: BsLightning, label: "Usage Units", href: "/admin/usage-units" },
      { icon: TbReceiptDollar, label: "Transactions", href: "/admin/transactions" },
    ],
  },
  {
    label: "SALES",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
      { icon: Gift, label: "Coupons & Discounts", href: "/admin/coupon-discount" },
      // { icon: DollarSign, label: "Revenue Reports", href: "/admin/revenue-report" },
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
    items: [
      { icon: Award, label: "Certificates", href: "/admin/certificates" },
      // { icon: Star, label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { icon: ChartColumn, label: "Analytics & Reports", href: "/admin/analytics-reports" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      
      { icon: Settings, label: "Settings", href: "/admin/setting" },
    ],
  },
];

const userItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/user" },
  { icon: GraduationCap, label: "My Courses", href: "/user/courses" },
  { icon: TrendingUp, label: "Progress", href: "/user/progress" },
  { icon: Award, label: "My Certificates", href: "/user/certificates" },
  { icon: User, label: "Profile", href: "/user/profile" },
  { icon: Settings, label: "Settings", href: "/user/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isCollapsed, toggleCollapse, isMobile } = useDashboard();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const isAdmin = pathname.startsWith("/admin");
  const panelTitle = isAdmin ? "Admin Panel" : "User Panel";

  const collapsed = isCollapsed && !isMobile;

  // Each group tracks its own open state. Default: all open.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(adminGroups.map((g) => [g.label, true]))
  );

  // Toggle a group open/closed on click
  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isItemActive = (href: string) =>
    pathname === href ||
    (href !== "/admin" && href !== "/user" && pathname.startsWith(href));

  // Single nav link — wraps itself in Tooltip when sidebar is collapsed
  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isItemActive(item.href);

    const linkEl = (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 border shadow-sm",
          active
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-900/40 border-transparent"
            : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white",
          collapsed ? "justify-center px-0 h-11 w-11 mx-auto" : ""
        )}
      >
        <item.icon
          className={cn(
            "h-[17px] w-[17px] shrink-0",
            active
              ? "text-white"
              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"
          )}
        />
        {/* Label: hidden when collapsed */}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    // In collapsed mode: wrap with Tooltip to show label on hover
    if (collapsed) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-slate-900 text-white border-slate-800 ml-2 text-xs font-medium"
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
        "relative flex h-full flex-col bg-[#0F172A] text-white transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-[80px]" : "w-64",
        className
      )}
    >
      {/* ── Collapse Toggle (Desktop only) ── */}
      {!isMobile && (
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 rounded-full border border-slate-700 bg-[#0F172A] p-0 text-slate-400 hover:bg-slate-800 hover:text-white md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* ── Logo ── */}
      <div
        className={cn(
          "flex h-24 items-center px-6 transition-all duration-300",
          collapsed ? "justify-center px-0" : ""
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden w-full">
          <div
            className={cn(
              "flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-2xl bg-gradient-to-br from-purple-300 to-indigo-300 font-bold text-white shadow-lg shadow-purple-900/40",
              collapsed ? "mx-auto" : ""
            )}
          >
            {/* IB */}
          <Image
            src="/Icon.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="text-base font-bold tracking-tight leading-none text-white">
                {panelTitle}
              </span>
              <span className="text-xs text-slate-400 mt-1">ISOBrain.ai</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 py-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="flex flex-col px-3">

          {/* ADMIN: grouped with collapsible headers */}
          {isAdmin &&
            adminGroups.map((group) => {
              const isOpen = openGroups[group.label] ?? true;
              const hasActiveItem = group.items.some((i) => isItemActive(i.href));

              return (
                <div key={group.label} className="mb-1">
                  {/* Group header — click to toggle, hidden when collapsed */}
                  {!collapsed && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-1 pt-4 pb-1.5 text-[10px] font-bold tracking-widest uppercase select-none cursor-pointer transition-colors",
                        hasActiveItem
                          ? "text-purple-400"
                          : "text-slate-500 hover:text-slate-300"
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

                  {/* Items — animated expand/collapse */}
                  <div
                    className={cn(
                      "flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out",
                      // In collapsed mode always show icons; in expanded mode respect isOpen
                      collapsed || isOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none"
                    )}
                  >
                    {group.items.map((item) => (
                      <NavLink key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}

          {/* USER: flat list */}
          {!isAdmin && (
            <div className="flex flex-col gap-1.5 pt-2">
              {userItems.map((item) => {
                const isSettings = item.label === "Settings";
                return (
                  <div key={item.href}>
                    {isSettings && (
                      <div className="py-2">
                        <Separator className="bg-slate-700/40" />
                      </div>
                    )}
                    <NavLink item={item} />
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      {/* ── Footer / Logout ── */}
      <div className="border-t border-slate-800 p-6">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setShowLogoutModal(true)}
                className="justify-center px-0 py-2 h-12 w-12 mx-auto bg-white hover:bg-slate-50 text-rose-500 hover:text-rose-600 rounded-xl transition-all font-semibold shadow-sm"
              >
                <LogOut className="h-5 w-5 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-slate-900 text-white border-slate-800 ml-2 text-xs font-medium"
            >
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowLogoutModal(true)}
            className="w-full justify-start gap-3 py-7 px-4 bg-white hover:bg-slate-50 text-rose-500 hover:text-rose-600 rounded-xl transition-all font-semibold shadow-sm"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        )}

        <LogoutConfirmationModal 
          open={showLogoutModal}
          onOpenChange={setShowLogoutModal}
          onConfirm={() => {
            dispatch(logout());
            router.push('/login');
            setShowLogoutModal(false);
          }}
        />
      </div>
    </div>
  );
}