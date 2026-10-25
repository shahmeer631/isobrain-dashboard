"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Star, ArrowUpRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const courses = [
  { 
    name: 'ISO 9001 Fundamentals', 
    students: 324, 
    percentage: 85, 
    avgScore: '92%', 
    revenue: '$12,400',
    trend: '+12%'
  },
  { 
    name: 'ISO 27001 Security', 
    students: 256, 
    percentage: 65, 
    avgScore: '88%', 
    revenue: '$9,800',
    trend: '+8%'
  },
  { 
    name: 'Internal Auditing', 
    students: 198, 
    percentage: 45, 
    avgScore: '85%', 
    revenue: '$7,200',
    trend: '+15%'
  },
]

export function TopCourses() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null)

  return (
    <Card className="col-span-1 h-full border border-[var(--ib-line)] dark:border-[var(--ib-line)] bg-white dark:bg-[var(--ib-dk)] shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="px-6 py-5 border-b border-[var(--ib-line)] dark:border-[var(--ib-line)]/50">
        <CardTitle className="text-lg font-black text-[var(--ib-ink)] dark:text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Top Performing Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {courses.map((course) => (
            <div 
              key={course.name} 
              className="group cursor-pointer space-y-3"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-black text-[var(--ib-ink)] dark:text-white group-hover:text-[var(--ib-acc)] transition-colors uppercase tracking-tight flex items-center gap-2">
                    {course.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all font-bold" />
                  </span>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold text-[var(--ib-acc)] flex items-center gap-1">
                       <Users className="h-3 w-3" /> {course.students} Learners
                     </span>
                     <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                       {course.trend}
                     </span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-[var(--ib-ink)] dark:text-white">{course.percentage}%</p>
                   <p className="text-[10px] font-bold text-[var(--ib-mute)] font-mono">POPULARITY</p>
                </div>
              </div>
              <Progress value={course.percentage} className="h-2.5 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] [&>div]:bg-[var(--ib-acc)] rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white dark:bg-[var(--ib-dk)] border-none rounded-3xl shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedCourse?.name || "Course Details"}</DialogTitle>
          </DialogHeader>
          <div className="bg-[var(--ib-acc)] p-8 text-white relative">
             <Trophy className="absolute top-4 right-4 h-12 w-12 text-white/10" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Detailed Analytics</p>
             <h2 className="text-2xl font-black tracking-tight">{selectedCourse?.name}</h2>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)]/50">
                   <p className="text-[10px] font-bold text-[var(--ib-mute)] uppercase mb-1">Average Score</p>
                   <p className="text-xl font-black text-[var(--ib-acc)]">{selectedCourse?.avgScore}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)]/50">
                   <p className="text-[10px] font-bold text-[var(--ib-mute)] uppercase mb-1">Total Revenue</p>
                   <p className="text-xl font-black text-emerald-600">{selectedCourse?.revenue}</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[var(--ib-mute)]">
                   <span>MARKET PENETRATION</span>
                   <span className="text-[var(--ib-acc)]">{selectedCourse?.percentage}%</span>
                </div>
                <Progress value={selectedCourse?.percentage} className="h-2 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] [&>div]:bg-[var(--ib-acc)]" />
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-3">
                   <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                   <div>
                      <p className="text-xs font-black text-amber-900 dark:text-amber-400">Top Rated</p>
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500/70">Highest learner satisfaction in category</p>
                   </div>
                </div>
             </div>

             <Button className="w-full bg-[var(--ib-dk)] dark:bg-white text-white dark:text-[var(--ib-ink)] rounded-xl h-12 font-bold shadow-xl" onClick={() => setSelectedCourse(null)}>
                Close Insights
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
