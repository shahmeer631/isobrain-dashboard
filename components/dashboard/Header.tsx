"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useGetProfileQuery } from "@/lib/redux/features/user/userApi"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { logout } from "@/lib/redux/features/auth/authSlice"
import { LogoutConfirmationModal } from "@/components/dashboard/LogoutConfirmationModal"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "@/components/dashboard/Sidebar"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  // Avoid Radix useId SSR/client mismatch (Sheet / DropdownMenu)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const { data: profileResponse, isLoading } = useGetProfileQuery()
  const user = profileResponse?.data

  const token = useAppSelector((state) => state.auth.token)

  const decodedUser = useMemo(() => {
    if (!token) return null
    try {
      const payloadBase64 = token.split('.')[1]
      if (!payloadBase64) return null
      const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decodedPayload)
    } catch {
      return null
    }
  }, [token])

  const tokenName = useMemo(() => {
    if (!decodedUser) return ""
    if (decodedUser.firstName || decodedUser.lastName) {
      return `${decodedUser.firstName || ''} ${decodedUser.lastName || ''}`.trim()
    }
    if (decodedUser.name) return decodedUser.name
    if (decodedUser.email) {
      return decodedUser.email.split('@')[0].split(/[._-]/).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    }
    return ""
  }, [decodedUser])

  const isAdmin = pathname.startsWith('/admin')
  
  // Dynamic user data variables
  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
    : (tokenName || (isAdmin ? "Admin Panel" : "Loading..."))
  const userEmail = user?.email || decodedUser?.email || (isAdmin ? "admin@isobrain.ai" : "Loading...")
  const roleVal = user?.role || decodedUser?.role
  const userTitle = roleVal === 'SUPER_ADMIN' ? "Super Admin" : roleVal === 'ADMIN' ? 'Administrator' : "User"
  const userAvatar = user?.profileImage || ""
  
  const initials = useMemo(() => {
    if (user) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    }
    if (userName && userName !== "Loading..." && userName !== "Admin Panel") {
      return userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    }
    return "IB"
  }, [user, userName])

  const userInitials = initials || "IB"
  const searchPlaceholder = isAdmin 
    ? "Search analytics, records or users..." 
    : "Search my courses, lessons or certificates..."

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-slate-800 bg-[#0F172A] px-6 text-slate-100 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Menu — mount Sheet only on client to keep Radix IDs stable */}
        <div className="md:hidden">
          {mounted ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-slate-800 bg-[#0F172A] p-0 text-slate-100">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar className="w-full border-none" />
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Open menu"
              disabled
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Search - Adjusted for Dark Theme */}
      <div className="flex w-full max-w-xl items-center gap-4 px-4 md:px-0">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={searchPlaceholder} 
            className="h-10 w-full bg-slate-800/50 pl-10 text-slate-200 placeholder:text-slate-500 border-none ring-offset-slate-900 focus-visible:ring-slate-700" 
          />
        </div>
      </div>

      {/* Right Actions - Adjusted for Dark Theme */}
      <div className="flex items-center gap-4">
        {/* <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0F172A]" />
        </Button> */}

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto gap-3 rounded-full border border-slate-700 bg-slate-800/50 pl-2 pr-4 text-slate-200 hover:bg-slate-800 hover:text-white">
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-purple-600 text-white font-bold text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-sm md:flex">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  ) : (
                    <>
                      <span className="font-semibold">{userName}</span>
                      <span className="text-xs text-slate-400">{userTitle}</span>
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-slate-800 bg-[#0F172A] text-slate-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{userName}</p>
                  <p className="text-xs leading-none text-slate-400">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer px-3 py-2">
                <Link href="/admin/setting" className="w-full h-full flex items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-slate-800 focus:text-red-500 cursor-pointer"
                onClick={() => setShowLogoutModal(true)}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            className="relative h-10 w-auto gap-3 rounded-full border border-slate-700 bg-slate-800/50 pl-2 pr-4 text-slate-200"
            aria-hidden
            tabIndex={-1}
          >
            <Avatar className="h-8 w-8 border border-slate-700">
              <AvatarFallback className="bg-purple-600 text-white font-bold text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start text-sm md:flex">
              <span className="font-semibold">{userName}</span>
              <span className="text-xs text-slate-400">{userTitle}</span>
            </div>
          </Button>
        )}

        <LogoutConfirmationModal 
          open={showLogoutModal}
          onOpenChange={setShowLogoutModal}
          onConfirm={() => {
            dispatch(logout())
            router.push('/login')
            setShowLogoutModal(false)
          }}
        />
      </div>
    </header>
  )
}
