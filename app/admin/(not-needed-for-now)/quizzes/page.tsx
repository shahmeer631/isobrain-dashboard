"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Search, 
  HelpCircle, 
  Timer, 
  Target, 
  Sparkles, 
  Edit2, 
  Trash2, 
  X,
  PlusCircle,
  AlertCircle,
  BookOpen
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Quiz {
  id: string
  courseTitle: string
  questionsCount: number
  duration: number
  passRate: number
  aiHints: boolean
  instantFeedback: boolean
}

const initialQuizzes: Quiz[] = [
  { 
    id: "1", 
    courseTitle: "ISO 9001 Fundamentals", 
    questionsCount: 20, 
    duration: 15, 
    passRate: 70, 
    aiHints: true,
    instantFeedback: true
  },
  { 
    id: "2", 
    courseTitle: "ISO 27001 Security", 
    questionsCount: 25, 
    duration: 20, 
    passRate: 75, 
    aiHints: false,
    instantFeedback: false
  },
]

const courses = [
  { id: "1", title: "ISO 9001 Fundamentals" },
  { id: "2", title: "ISO 27001 Security" },
  { id: "3", title: "Internal Auditing" },
]

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState(initialQuizzes)
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Selected Item for Edit/Delete
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  
  // Form State
  const [quizForm, setQuizForm] = useState({
    courseTitle: "ISO 9001 Fundamentals",
    questionsCount: "20",
    duration: "15",
    passRate: "70",
    aiHints: true,
    instantFeedback: true
  })

  const handleOpenCreateModal = () => {
    setQuizForm({
      courseTitle: "ISO 9001 Fundamentals",
      questionsCount: "20",
      duration: "15",
      passRate: "70",
      aiHints: true,
      instantFeedback: true
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setQuizForm({
      courseTitle: quiz.courseTitle,
      questionsCount: quiz.questionsCount.toString(),
      duration: quiz.duration.toString(),
      passRate: quiz.passRate.toString(),
      aiHints: quiz.aiHints,
      instantFeedback: quiz.instantFeedback
    })
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleCreateQuiz = () => {
    const newQuiz = {
      id: Math.random().toString(36).substr(2, 9),
      courseTitle: quizForm.courseTitle,
      questionsCount: parseInt(quizForm.questionsCount),
      duration: parseInt(quizForm.duration),
      passRate: parseInt(quizForm.passRate),
      aiHints: quizForm.aiHints,
      instantFeedback: quizForm.instantFeedback
    }
    setQuizzes([...quizzes, newQuiz])
    setIsCreateModalOpen(false)
  }

  const handleUpdateQuiz = () => {
    if (!currentQuiz) return
    setQuizzes(quizzes.map(q => q.id === currentQuiz.id ? {
      ...q,
      courseTitle: quizForm.courseTitle,
      questionsCount: parseInt(quizForm.questionsCount),
      duration: parseInt(quizForm.duration),
      passRate: parseInt(quizForm.passRate),
      aiHints: quizForm.aiHints,
      instantFeedback: quizForm.instantFeedback
    } : q))
    setIsEditModalOpen(false)
  }

  const handleDeleteQuiz = () => {
    if (!currentQuiz) return
    setQuizzes(quizzes.filter(q => q.id !== currentQuiz.id))
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Quiz & Assessment Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and manage course assessments</p>
        </div>
        
        <Button 
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-600/20 py-2 h-11 px-6 rounded-xl font-medium"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Quiz
        </Button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden rounded-2xl group hover:shadow-md transition-all duration-300">
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{quiz.courseTitle}</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{quiz.questionsCount} Questions</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(quiz)} className="h-8 w-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(quiz)} className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Timer Duration:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{quiz.duration} minutes</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Pass Rate:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{quiz.passRate}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">AI Hints:</span>
                  <span className={cn(
                    "font-semibold",
                    quiz.aiHints ? "text-emerald-500" : "text-red-500"
                  )}>
                    {quiz.aiHints ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 transition-all mt-4">
                View Questions
              </Button>
            </CardContent>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
            <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No quizzes found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Create your first quiz to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create Quiz</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label>Select Course</Label>
              <Select value={quizForm.courseTitle} onValueChange={(val) => setQuizForm({...quizForm, courseTitle: val})}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 h-11">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Input type="number" value={quizForm.questionsCount} onChange={(e) => setQuizForm({...quizForm, questionsCount: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <Label>Timer Duration (minutes)</Label>
              <Input type="number" value={quizForm.duration} onChange={(e) => setQuizForm({...quizForm, duration: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <Label>Pass Mark (%)</Label>
              <Input type="number" value={quizForm.passRate} onChange={(e) => setQuizForm({...quizForm, passRate: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable AI Hints</Label>
                <Switch checked={quizForm.aiHints} onCheckedChange={(val) => setQuizForm({...quizForm, aiHints: val})} className="data-[state=checked]:bg-purple-600" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Instant Feedback</Label>
                <Switch checked={quizForm.instantFeedback} onCheckedChange={(val) => setQuizForm({...quizForm, instantFeedback: val})} className="data-[state=checked]:bg-purple-600" />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-6 bg-slate-50 dark:bg-slate-800/30 gap-3">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleCreateQuiz} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Create Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Edit Quiz</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label>Select Course</Label>
              <Select value={quizForm.courseTitle} onValueChange={(val) => setQuizForm({...quizForm, courseTitle: val})}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 h-11">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Input type="number" value={quizForm.questionsCount} onChange={(e) => setQuizForm({...quizForm, questionsCount: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <Label>Timer Duration (minutes)</Label>
              <Input type="number" value={quizForm.duration} onChange={(e) => setQuizForm({...quizForm, duration: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-2">
              <Label>Pass Mark (%)</Label>
              <Input type="number" value={quizForm.passRate} onChange={(e) => setQuizForm({...quizForm, passRate: e.target.value})} className="bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable AI Hints</Label>
                <Switch checked={quizForm.aiHints} onCheckedChange={(val) => setQuizForm({...quizForm, aiHints: val})} className="data-[state=checked]:bg-purple-600" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Instant Feedback</Label>
                <Switch checked={quizForm.instantFeedback} onCheckedChange={(val) => setQuizForm({...quizForm, instantFeedback: val})} className="data-[state=checked]:bg-purple-600" />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-6 bg-slate-50 dark:bg-slate-800/30 gap-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handleUpdateQuiz} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Delete Quiz?</DialogTitle>
              <DialogDescription className="mt-2 text-slate-500">
                Are you sure you want to delete the quiz for <span className="font-semibold text-slate-900 dark:text-white">"{currentQuiz?.courseTitle}"</span>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleDeleteQuiz}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
