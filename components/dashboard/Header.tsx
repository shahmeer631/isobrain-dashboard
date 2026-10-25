"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/redux/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth/authSlice";
import { LogoutConfirmationModal } from "@/components/dashboard/LogoutConfirmationModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (pathname.startsWith("/admin")) {
      return;
    }
    router.push(`/user/courses?q=${encodeURIComponent(q)}`);
  };

  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const user = profileResponse?.data;

  const token = useAppSelector((state) => state.auth.token);

  const decodedUser = useMemo(() => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return null;
      const decodedPayload = atob(
        payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
      );
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  }, [token]);

  const tokenName = useMemo(() => {
    if (!decodedUser) return "";
    if (decodedUser.firstName || decodedUser.lastName) {
      return `${decodedUser.firstName || ""} ${decodedUser.lastName || ""}`.trim();
    }
    if (decodedUser.name) return decodedUser.name;
    if (decodedUser.email) {
      return decodedUser.email
        .split("@")[0]
        .split(/[._-]/)
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }
    return "";
  }, [decodedUser]);

  const isAdmin = pathname.startsWith("/admin");

  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : tokenName || (isAdmin ? "Admin Panel" : "Loading...");
  const userEmail =
    user?.email ||
    decodedUser?.email ||
    (isAdmin ? "admin@isobrain.ai" : "Loading...");
  const roleVal = user?.role || decodedUser?.role;
  const userTitle =
    roleVal === "SUPER_ADMIN"
      ? "Super Admin"
      : roleVal === "ADMIN"
        ? "Administrator"
        : "User";
  const userAvatar = user?.profileImage || "";

  const initials = useMemo(() => {
    if (user) {
      return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
    }
    if (userName && userName !== "Loading..." && userName !== "Admin Panel") {
      return userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "IB";
  }, [user, userName]);

  const userInitials = initials || "IB";
  const searchPlaceholder = isAdmin
    ? "Search analytics, records or users..."
    : "Search my courses, lessons or certificates…";
  const settingsHref = isAdmin ? "/admin/setting" : "/user/settings";
  const profileHref = isAdmin ? "/admin" : "/user/profile";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-auto w-full items-center gap-4 border-b border-[var(--ib-line)] bg-[color-mix(in_srgb,var(--ib-side)_92%,transparent)] px-5 py-[14px] text-[var(--ib-ink)] backdrop-blur-md transition-all duration-300 min-[981px]:gap-5 min-[981px]:px-8"
      )}
    >
      <div className="flex items-center min-[981px]:hidden">
        {mounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--ib-mute)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-ink)]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] border-r border-[var(--ib-line)] bg-[var(--ib-side)] p-0 text-[var(--ib-ink)]"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar className="w-full border-none" />
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--ib-mute)]"
            aria-label="Open menu"
            disabled
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="relative flex w-full max-w-[520px] flex-1 items-center"
      >
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[var(--ib-mute)]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-[11px] border border-[var(--ib-line)] bg-[var(--ib-bg)] pl-10 text-sm text-[var(--ib-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[var(--ib-mute)] transition-[border-color,box-shadow] focus-visible:border-[color-mix(in_srgb,var(--ib-acc)_40%,var(--ib-line))] focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)]/20"
          aria-label="Search"
        />
      </form>

      <div className="ml-auto flex items-center gap-2.5">
        <ThemeToggle />
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-auto w-auto gap-2.5 rounded-full border border-[var(--ib-line)] bg-[var(--ib-side)] py-1.5 pl-1.5 pr-3 text-[var(--ib-ink)] hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-ink)]"
              >
                <Avatar className="h-8 w-8 border-0">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-[var(--ib-accbg)] text-[12px] font-bold text-[var(--ib-acc)]">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left min-[640px]:flex">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--ib-mute)]" />
                  ) : (
                    <>
                      <span className="text-[13px] font-semibold leading-tight">
                        {userName}
                      </span>
                      <span className="text-[12px] leading-tight text-[var(--ib-mute)]">
                        {userTitle}
                      </span>
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-[var(--ib-line)] bg-[var(--ib-card)] text-[var(--ib-ink)]"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--ib-ink)]">
                    {userName}
                  </p>
                  <p className="text-xs leading-none text-[var(--ib-mute)]">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--ib-line)]" />
              {!isAdmin && (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer px-3 py-2 focus:bg-[var(--ib-accbg)] focus:text-[var(--ib-acc)]"
                >
                  <Link href={profileHref} className="flex h-full w-full items-center">
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                asChild
                className="cursor-pointer px-3 py-2 focus:bg-[var(--ib-accbg)] focus:text-[var(--ib-acc)]"
              >
                <Link href={settingsHref} className="flex h-full w-full items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--ib-line)]" />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:bg-[var(--ib-accbg)] focus:text-red-600"
                onClick={() => setShowLogoutModal(true)}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            className="relative h-auto w-auto gap-2.5 rounded-full border border-[var(--ib-line)] bg-[var(--ib-side)] py-1.5 pl-1.5 pr-3"
            aria-hidden
            tabIndex={-1}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[var(--ib-accbg)] text-[12px] font-bold text-[var(--ib-acc)]">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-[13px] font-semibold">{userName}</span>
              <span className="text-[12px] text-[var(--ib-mute)]">{userTitle}</span>
            </div>
          </Button>
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
    </header>
  );
}
