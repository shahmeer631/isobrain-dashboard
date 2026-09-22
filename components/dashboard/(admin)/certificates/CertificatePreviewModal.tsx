"use client";

import React from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Button } from "@/components/ui/button";
import { ICertificateTemplate } from "@/types/certificateTypes";
import { CertificatePreview } from "./CertificatePreview";
import { Printer, X } from "lucide-react";

interface CertificatePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: ICertificateTemplate | null;
}

export function CertificatePreviewModal({
  open,
  onOpenChange,
  certificate,
}: CertificatePreviewModalProps) {
  if (!certificate) return null;

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Certificate Preview"
      maxWidth="sm:max-w-[1000px]"
    >
      <div className="flex flex-col items-center gap-8 py-4">
        <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-4 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
          <CertificatePreview data={{
            name: certificate.name,
            title: certificate.title,
            subtitle: certificate.subtitle,
            bodyText: certificate.bodyText,
            templateType: certificate.templateType,
            signature1: certificate.signature1,
            signature2: certificate.signature2,
            footerText: certificate.footerText,
            autoIssue: certificate.autoIssue
          }} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 h-12 rounded-xl font-bold text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
          <Button
            className="w-full sm:flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[16px] shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5" />
            Print Certificate
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
