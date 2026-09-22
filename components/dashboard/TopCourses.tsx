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
    <Card className="col-span-1 h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800/50">
        <CardTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
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
                  <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight flex items-center gap-2">
                    {course.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all font-bold" />
                  </span>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                       <Users className="h-3 w-3" /> {course.students} Learners
                     </span>
                     <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                       {course.trend}
                     </span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-900 dark:text-white">{course.percentage}%</p>
                   <p className="text-[10px] font-bold text-slate-400 font-mono">POPULARITY</p>
                </div>
              </div>
              <Progress value={course.percentage} className="h-2.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-indigo-600 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedCourse?.name || "Course Details"}</DialogTitle>
          </DialogHeader>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative">
             <Trophy className="absolute top-4 right-4 h-12 w-12 text-white/10" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Detailed Analytics</p>
             <h2 className="text-2xl font-black tracking-tight">{selectedCourse?.name}</h2>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Average Score</p>
                   <p className="text-xl font-black text-indigo-600">{selectedCourse?.avgScore}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Revenue</p>
                   <p className="text-xl font-black text-emerald-600">{selectedCourse?.revenue}</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                   <span>MARKET PENETRATION</span>
                   <span className="text-purple-600">{selectedCourse?.percentage}%</span>
                </div>
                <Progress value={selectedCourse?.percentage} className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-purple-600" />
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

             <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl h-12 font-bold shadow-xl" onClick={() => setSelectedCourse(null)}>
                Close Insights
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
