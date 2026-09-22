
import React from 'react'
import DashboardShell from '@/components/dashboard/dashboard-shell'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'

export default function UserLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <DashboardShell 
        stats={null} 
        enrollments={null} 
        topCourses={null} 
      >
        {children}
      </DashboardShell>
    </DashboardProvider>
  )
}
