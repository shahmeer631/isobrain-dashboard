"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Eye, GraduationCap, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const initialEnrollments = [
  { id: '1', name: 'James Wilson', avatar: '', course: 'ISO 9001 Fundamentals', time: '2h ago', progress: 45 },
  { id: '2', name: 'Sarah Johnson', avatar: '', course: 'ISO 27001 Security', time: '3h ago', progress: 82 },
  { id: '3', name: 'Michael Brown', avatar: '', course: 'Internal Auditing', time: '5h ago', progress: 12 },
  { id: '4', name: 'Emily Davis', avatar: '', course: 'Risk Management 101', time: '1d ago', progress: 95 },
  { id: '5', name: 'Robert Martinez', avatar: '', course: 'Cybersecurity Basics', time: '1d ago', progress: 30 },
]

interface Enrollment {
  id: string
  name: string
  avatar: string
  course: string
  time: string
  progress: number
}

export function RecentEnrollments() {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  
  return (
    <Card className="col-span-1 h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800/50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
           <GraduationCap className="h-5 w-5 text-purple-600" />
           Recent Enrollments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {initialEnrollments.map((item) => (
            <div key={item.id} className="group flex items-center justify-between transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                    <AvatarFallback className="text-xs font-black bg-transparent">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors uppercase tracking-tight">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-[10px] font-bold text-slate-400">{item.time}</span>
                <Button 
                  onClick={() => setSelectedEnrollment(item)}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-purple-600 hover:text-white transition-all transform group-hover:scale-110"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedEnrollment} onOpenChange={() => setSelectedEnrollment(null)}>
        <DialogContent className="sm:max-w-[400px] p-6 bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Enrollment Details</DialogTitle>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-purple-600/10 flex items-center justify-center border-4 border-purple-500/10">
                  <Avatar className="h-16 w-16 rounded-xl">
                    <AvatarFallback className="text-xl font-black text-purple-600">
                      {selectedEnrollment.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEnrollment.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{selectedEnrollment.course}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="font-bold text-slate-500">Learning Progress</span>
                   <span className="font-black text-purple-600">{selectedEnrollment.progress}%</span>
                 </div>
                 <Progress value={selectedEnrollment.progress} className="h-2.5 bg-slate-200 dark:bg-slate-800/50 [&>div]:bg-purple-600" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 font-bold uppercase">Enrolled On</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedEnrollment.time}</span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-slate-500 font-bold uppercase">Status</span>
                  <span className="text-emerald-500 font-bold italic">Active Learner</span>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-600/20" onClick={() => setSelectedEnrollment(null)}>
                Close Viewer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
