
"use client"

import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { cn } from "@/lib/utils"

export default function DashboardShell({
  children,
  stats,
  enrollments,
  topCourses,
}: {
  children: React.ReactNode
  stats: React.ReactNode
  enrollments: React.ReactNode
  topCourses: React.ReactNode
}) {
  const { isCollapsed } = useDashboard()

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
      {/* Sidebar for Desktop - Hidden on Mobile via CSS */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-slate-800 bg-[#0F172A] transition-all duration-300 ease-in-out md:block",
          isCollapsed ? "w-[80px]" : "w-64"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main Content Wrapper */}
      <div 
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out pl-0",
          isCollapsed ? "md:pl-[80px]" : "md:pl-64"
        )}
      >
        <Header />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-900/50 [scrollbar-gutter:stable]">
          <div className="mx-auto max-w-8xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {/* <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"> */}
            {/* Page Content */}
            {children}
            
            {/* Dashboard Widgets */}
            <div className="space-y-6">
               {stats}
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 {enrollments}
                 {topCourses}
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
