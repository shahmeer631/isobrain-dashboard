"use client"

import React, { useState } from "react"
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Award, 
  Download, 
  ChevronRight,
  FileText,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
  ChevronDown,
  FileDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const reportTypes = [
  {
    id: "course-completion",
    title: "Course Completion Report",
    description: "Download detailed course completion statistics and enrolment data.",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10"
  },
  {
    id: "assessment-performance",
    title: "Assessment Performance",
    description: "View pass/fail statistics, average scores, and assessment trends.",
    icon: PieChart,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/10"
  },
  {
    id: "user-activity",
    title: "User Activity Tracking",
    description: "Track user engagement, daily active users, and learning time.",
    icon: Activity,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/10"
  },
  {
    id: "certificate-issuance",
    title: "Certificate Issuance",
    description: "Export certificate records, validation analytics, and issuance logs.",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/10"
  }
]

export default function ReportsPage() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState("Last 30 Days")

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId)
    setGenerationProgress(0)
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setGeneratingReport(null)
            setIsSuccessModalOpen(true)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const activeReport = reportTypes.find(r => r.id === generatingReport)

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Track platform performance and user activity</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-slate-200 dark:border-slate-800 rounded-xl h-11 px-6 font-semibold bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
              {dateRange}
              <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 animation-in fade-in zoom-in duration-200">
            <DropdownMenuLabel className="text-xs font-bold text-slate-400 px-2 py-1.5 uppercase tracking-wider">Select Range</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
            {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Quarter", "Year to Date"].map((range) => (
              <DropdownMenuItem 
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "rounded-lg px-2 py-2 cursor-pointer transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400",
                  dateRange === range && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                )}
              >
                {range}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm", report.bgColor)}>
                  <report.icon className={cn("h-7 w-7", report.color)} />
                </div>
                <Button 
                  onClick={() => handleGenerateReport(report.id)}
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl transition-all"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{report.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[90%] font-medium">
                  {report.description}
                </p>
              </div>

              <Button 
                onClick={() => handleGenerateReport(report.id)}
                disabled={!!generatingReport}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl h-12 font-bold shadow-lg shadow-purple-600/10 transition-all active:scale-[0.98]"
              >
                {generatingReport === report.id ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compiling Data...</>
                ) : (
                  <><FileDown className="mr-2 h-4 w-4" /> Generate Report</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generation Status Modal */}
      <Dialog open={!!generatingReport} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[420px] p-8 bg-white dark:bg-slate-900 border-none rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-slate-100 dark:border-slate-800/50 flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 ring-8 ring-indigo-500/5">
                 {activeReport && <activeReport.icon className={cn("h-10 w-10 animate-pulse", activeReport.color)} />}
              </div>
              <div className="absolute inset-0 h-24 w-24 rounded-full border-t-4 border-indigo-500 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Generating Report</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                We're currently gathering intelligence for your <span className="font-bold text-indigo-600 dark:text-indigo-400 italic">"{activeReport?.title}"</span>.
              </DialogDescription>
            </div>

            <div className="w-full space-y-3 bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                <span>Progress</span>
                <span className="text-indigo-600">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-3 bg-slate-200 dark:bg-slate-800/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-indigo-600 shadow-inner rounded-full" />
              <p className="text-[10px] text-slate-400 italic">Please do not close this window</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-8 bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl overflow-hidden">
           {/* Decorative background glow */}
           <div className="absolute -top-10 -right-10 h-40 w-40 bg-emerald-500/10 blur-[50px] rounded-full" />
           
          <div className="relative flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 ring-8 ring-emerald-500/10 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Ready!</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                The requested statistics have been compiled and exported successfully.
              </DialogDescription>
            </div>
          </div>
          <div className="relative flex flex-col gap-3 mt-8">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
              <Download className="h-5 w-5" /> Download (PDF / CSV)
            </Button>
            <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400" onClick={() => setIsSuccessModalOpen(false)}>
              Back to Reports
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
