"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Search, 
  Play, 
  Lock, 
  Unlock, 
  Edit2, 
  Trash2, 
  ChevronDown,
  X,
  PlusCircle,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const courses = [
  { id: "1", title: "ISO 9001 Fundamentals" },
  { id: "2", title: "ISO 27001 Security" },
  { id: "3", title: "Internal Auditing" },
]

interface Lesson {
  id: string
  courseId: string
  title: string
  duration: string
  videoUrl?: string
  description?: string
  isLocked: boolean
  order: number
}

const initialLessons = [
  { 
    id: "1", 
    courseId: "1", 
    title: "Introduction to ISO 9001", 
    duration: "15:30", 
    videoUrl: "https://youtube.com/watch?v=1",
    description: "Basic overview of ISO 9001 standards.",
    isLocked: false,
    order: 1 
  },
  { 
    id: "2", 
    courseId: "1", 
    title: "Quality Management Principles", 
    duration: "22:15", 
    videoUrl: "https://youtube.com/watch?v=2",
    description: "Deep dive into the 7 principles.",
    isLocked: false,
    order: 2 
  },
  { 
    id: "3", 
    courseId: "1", 
    title: "Process Approach", 
    duration: "18:45", 
    videoUrl: "https://youtube.com/watch?v=3",
    description: "Understanding the process approach in auditing.",
    isLocked: true,
    order: 3 
  },
  { 
    id: "4", 
    courseId: "2", 
    title: "ISMS Overview", 
    duration: "12:00", 
    videoUrl: "https://youtube.com/watch?v=4",
    description: "Information Security Management System basics.",
    isLocked: false,
    order: 1 
  },
]

export default function LessonsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id)
  const [lessons, setLessons] = useState(initialLessons)
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Selected Item for Edit/Delete
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  
  // Form State
  const [lessonForm, setLessonForm] = useState({
    title: "",
    videoUrl: "",
    description: "",
    order: "1",
    isLocked: false
  })

  const filteredLessons = lessons
    .filter(lesson => lesson.courseId === selectedCourseId)
    .sort((a, b) => a.order - b.order)

  const handleOpenAddModal = () => {
    setLessonForm({
      title: "",
      videoUrl: "",
      description: "",
      order: (filteredLessons.length + 1).toString(),
      isLocked: false
    })
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setLessonForm({
      title: lesson.title,
      videoUrl: lesson.videoUrl || "",
      description: lesson.description || "",
      order: lesson.order.toString(),
      isLocked: lesson.isLocked
    })
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setIsDeleteModalOpen(true)
  }

  const handleAddLesson = () => {
    if (!lessonForm.title) return
    const lessonToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: selectedCourseId,
      title: lessonForm.title,
      videoUrl: lessonForm.videoUrl,
      description: lessonForm.description,
      duration: "00:00",
      isLocked: lessonForm.isLocked,
      order: parseInt(lessonForm.order)
    }
    setLessons([...lessons, lessonToAdd])
    setIsAddModalOpen(false)
  }

  const handleUpdateLesson = () => {
    if (!currentLesson || !lessonForm.title) return
    setLessons(lessons.map(l => l.id === currentLesson.id ? {
      ...l,
      title: lessonForm.title,
      videoUrl: lessonForm.videoUrl,
      description: lessonForm.description,
      isLocked: lessonForm.isLocked,
      order: parseInt(lessonForm.order)
    } : l))
    setIsEditModalOpen(false)
  }

  const handleDeleteLesson = () => {
    if (!currentLesson) return
    setLessons(lessons.filter(l => l.id !== currentLesson.id))
    setIsDeleteModalOpen(false)
  }

  const toggleLock = (id: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, isLocked: !l.isLocked } : l))
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lesson Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage course lessons and content</p>
        </div>
        
        <Button 
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-600/20 py-2 h-11 px-6 rounded-xl font-medium"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Lesson
        </Button>
      </div>

      {/* Course Selection Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-purple-500">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id} className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 rounded-lg mx-1">
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 hover:border-purple-500/30 dark:hover:border-purple-500/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-sm shadow-md shadow-purple-600/20">
                    {lesson.order}
                  </div>
                  
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Duration: {lesson.duration}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => toggleLock(lesson.id)}
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-9 w-9 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
                        lesson.isLocked && "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {lesson.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4 text-emerald-500" />}
                    </Button>
                    <Button 
                      onClick={() => handleOpenEditModal(lesson)}
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleOpenDeleteModal(lesson)}
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <PlusCircle className="h-8 w-8 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No lessons found</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Start by adding the first lesson to this course.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Add New Lesson</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input 
                value={lessonForm.title}
                onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                placeholder="e.g., Introduction to ISO" 
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input 
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                placeholder="https://..." 
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={lessonForm.description}
                onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: e.target.value})} />
              </div>
              <div className="flex items-center justify-between pt-8">
                <Label>Locked</Label>
                <Switch checked={lessonForm.isLocked} onCheckedChange={(val) => setLessonForm({...lessonForm, isLocked: val})} />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-6 bg-slate-50 dark:bg-slate-800/30 gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLesson} className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Edit Lesson</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input 
                value={lessonForm.title}
                onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input 
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={lessonForm.description}
                onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                className="bg-slate-50 dark:bg-slate-800/50 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: e.target.value})} />
              </div>
              <div className="flex items-center justify-between pt-8">
                <Label>Locked</Label>
                <Switch checked={lessonForm.isLocked} onCheckedChange={(val) => setLessonForm({...lessonForm, isLocked: val})} />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-6 bg-slate-50 dark:bg-slate-800/30 gap-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateLesson} className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Delete Lesson?</DialogTitle>
              <DialogDescription className="mt-2 text-slate-500">
                Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{currentLesson?.title}"</span>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleDeleteLesson}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
