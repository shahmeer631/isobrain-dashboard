"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Upload, 
  Settings, 
  Award, 
  Download, 
  QrCode, 
  FileText,
  CheckCircle2,
  X,
  UploadCloud
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

const recentCertificates = [
  { id: "CERT-2026-001", user: "User 1", course: "ISO 9001", date: "2026-02-15" },
  { id: "CERT-2026-002", user: "User 2", course: "ISO 9001", date: "2026-02-14" },
  { id: "CERT-2026-003", user: "User 3", course: "ISO 9001", date: "2026-02-14" },
  { id: "CERT-2026-004", user: "User 4", course: "ISO 9001", date: "2026-02-13" },
]

export default function CertificatesPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [template, setTemplate] = useState("default")
  const [idFormat, setIdFormat] = useState("CERT-{YEAR}-{ID}")
  const [enableQR, setEnableQR] = useState(true)

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Certificate Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage CPD certificates and templates</p>
        </div>
        
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-600/20 py-2 h-11 px-6 rounded-xl font-medium">
              <Upload className="mr-2 h-5 w-5" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Upload Template</DialogTitle>
              <DialogDescription>Upload a new PDF or Image template for certificates.</DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-slate-800/20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                <UploadCloud className="h-10 w-10 text-slate-400" />
                <p className="text-sm text-slate-400">Drag and drop file here or click to browse</p>
              </div>
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Premium 2026 Template" className="bg-slate-50 dark:bg-slate-800/50" />
              </div>
            </div>
            <DialogFooter className="px-6 py-6 bg-slate-50 dark:bg-slate-800/30 gap-3">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 rounded-xl">Cancel</Button>
              </DialogClose>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Upload Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500" />
              Certificate Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Certificate Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-purple-500 transition-all">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectItem value="default" className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 rounded-lg">Default Template</SelectItem>
                  <SelectItem value="premium" className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 rounded-lg">Premium Template</SelectItem>
                  <SelectItem value="classic" className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 rounded-lg">Classic Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Certificate ID Format</Label>
              <Input 
                value={idFormat} 
                onChange={(e) => setIdFormat(e.target.value)}
                placeholder="CERT-{YEAR}-{ID}" 
                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-purple-500 transition-all"
              />
              <p className="text-xs text-slate-400 italic">Example: CERT-2026-001</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Enable QR Code</Label>
                  <p className="text-xs text-slate-400">Add verification QR code to bottom right</p>
                </div>
              </div>
              <Switch checked={enableQR} onCheckedChange={setEnableQR} className="data-[state=checked]:bg-purple-600" />
            </div>

            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/10 transition-all">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Recent Certificates Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Recent Certificates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentCertificates.map((cert) => (
              <div 
                key={cert.id} 
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-indigo-500 font-bold group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 transition-colors">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cert.id}</h4>
                    <p className="text-xs text-slate-500">{cert.course} - {cert.user}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-lg">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full h-11 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              View All Certificates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
