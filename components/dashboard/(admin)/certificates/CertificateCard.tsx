"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Edit, Eye, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

import { ICertificateTemplate } from "@/types/certificateTypes";

export interface CertificateCardProps {
  certificate: ICertificateTemplate;
  onEdit: (cert: ICertificateTemplate) => void;
  onPreview: (cert: ICertificateTemplate) => void;
  onDesign: (cert: ICertificateTemplate) => void;
}

export function CertificateCard({
  certificate,
  onEdit,
  onPreview,
  onDesign,
}: CertificateCardProps) {
  const getIconColorCls = (template?: string) => {
    switch (template) {
      case "Modern Minimalist":
        return "text-orange-600";
      case "Professional Blue":
        return "text-blue-600";
      case "Corporate Purple":
        return "text-purple-600";
      case "Nature Green":
        return "text-emerald-600";
      case "Elegant Gold":
        return "text-amber-600";
      default:
        return "text-indigo-600";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Top Header: ID & Badge */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-white" />
          </div>
          <span className="text-[13px] font-bold text-slate-900 dark:text-white">
            ID: {certificate.id.slice(-6).toUpperCase()}
          </span>
        </div>
        <Badge
          className={cn(
            "border-none px-2.5 py-1 text-[11px] font-bold rounded-md",
            certificate.isActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800",
          )}
        >
          {certificate.isActive ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Title & Author */}
      <div className="mb-6 flex-1">
        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[44px]">
          {certificate.name}
        </h3>
        <p className="text-[13px] text-slate-500 mt-1">
          by System
        </p>
      </div>

      {/* Stats Grid 2x2 */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
        <div>
          <p className="text-[11px] text-slate-500 font-medium mb-1">
            Certificates Issued
          </p>
          <p className="text-[14px] font-bold text-slate-900 dark:text-white">
            {certificate.certificatesIssued || 0}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-medium mb-1">
            Attached Courses
          </p>
          <p className="text-[14px] font-bold text-slate-900 dark:text-white">
            {certificate.courses?.length || certificate.attachedCourses || 0}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-medium mb-1">
            Auto-Issue
          </p>
          <p className="text-[14px] font-bold text-slate-900 dark:text-white">
            {certificate.autoIssue ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-medium mb-1">
            Created
          </p>
          <p className="text-[14px] font-bold text-slate-900 dark:text-white">
            {certificate.createdAt ? new Date(certificate.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Rating & Date */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[13px] font-bold text-slate-900 dark:text-white">4.8</span>
        </div>
        <span className="text-[12px] text-slate-400 font-medium">
          {certificate.updatedAt ? new Date(certificate.updatedAt).toLocaleDateString() : ""}
        </span>
      </div>

      {/* Buttons Row */}
      <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
        <Button
          variant="outline"
          className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => onEdit(certificate)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => onDesign(certificate)}
        >
          <Award className="w-4 h-4 mr-2" />
          Assign
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-5 mb-4" />

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onDesign(certificate)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Palette className="w-4 h-4" />
          Design
        </button>
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-rose-500 hover:text-rose-600 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
