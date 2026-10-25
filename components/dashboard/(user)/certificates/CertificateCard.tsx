import React from "react";
import {
  Award,
  Calendar,
  Share2,
  Download,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { ICertificate } from "@/types/userDashboardTypes";

interface CertificateCardProps {
  certificate: ICertificate;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  onView: (id: string) => void;
}

export function CertificateCard({
  certificate,
  onDownload,
  onShare,
  onView,
}: CertificateCardProps) {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="ib-card ib-card-interactive group flex min-h-[220px] flex-col overflow-hidden md:flex-row">
      {/* Left Banner */}
      <div className="relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden bg-[var(--ib-acc)] p-8 text-center text-white md:w-72">
        <div className="pointer-events-none absolute -mr-10 -mt-10 top-0 right-0 size-32 rounded-bl-full bg-white/5" />
        <div className="mb-4 transition-transform duration-500 motion-safe:group-hover:scale-105">
          <Award className="h-16 w-16 text-amber-300 drop-shadow-md" aria-hidden />
        </div>
        <h3 className="text-lg font-black tracking-tight mb-2 leading-tight">
          Certificate of Completion
        </h3>
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-4">
          This certifies that
        </p>
        <p className="text-xl font-black mb-4">
          {certificate.studentName || "Student Name"}
        </p>
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">
          has successfully completed
        </p>
        <p className="text-sm font-black mb-4 leading-tight">
          {certificate.courseName}
        </p>
        <p className="text-[9px] opacity-60 font-medium">
          Certificate ID: {certificate.id}
        </p>
      </div>

      {/* Right Content */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-[18px] font-black tracking-tight text-[var(--ib-ink)] dark:text-white">
                  {certificate.courseName}
                </h3>
                {certificate.verified && (
                  <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-[var(--ib-mute)] dark:text-[var(--ib-mute)]">
                Instructor: {certificate.instructor}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-4 w-4 text-[var(--ib-mute)]" />
              <span className="text-[var(--ib-mute)] font-medium">Issued on:</span>
              <span className="font-black text-[var(--ib-ink)] dark:text-white">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Award className="h-4 w-4 text-[var(--ib-mute)]" />
              <span className="text-[var(--ib-mute)] font-medium">
                Certificate ID:
              </span>
              <span className="font-black text-[var(--ib-ink)] dark:text-white">
                {certificate.id}
              </span>
            </div>

            {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[var(--ib-mute)]" />
                <span className="text-[var(--ib-mute)] font-medium">
                  Credential URL:
                </span>
              </div>
              <a
                href="#"
                className="font-bold text-blue-500 hover:text-blue-600 truncate max-w-[200px] sm:max-w-none ml-6 sm:ml-0"
              >
                #
              </a>
            </div> */}
          </div>
        </div>

        {/* Bottom Actions & Tip */}
        <div className="space-y-6 mt-6 pt-6 border-t border-[var(--ib-line)] dark:border-[var(--ib-line)]">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onDownload(certificate.courseId as string)}
              className=" h-10 px-6 "
              variant="primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {/* <Button
              variant="outline"
              onClick={() => onView(certificate.id)}
              className="border-[var(--ib-line)] dark:border-[var(--ib-line)] bg-white dark:bg-[var(--ib-dk)] text-[var(--ib-ink)] dark:text-[var(--ib-mute)] hover:bg-[var(--ib-bg)] font-bold text-xs h-10 px-4 "
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Size
            </Button>
            <Button
              variant="outline"
              onClick={() => onShare(certificate.id)}
              className="border-[var(--ib-line)] dark:border-[var(--ib-line)] bg-white dark:bg-[var(--ib-dk)] text-[var(--ib-ink)] dark:text-[var(--ib-mute)] hover:bg-[var(--ib-bg)] font-bold text-xs h-10 px-4 "
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button> */}
          </div>

          {/* Tip Box */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-3 flex items-start gap-2 border border-blue-100/50 dark:border-blue-800/50">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--ib-mute)] dark:text-[var(--ib-mute)] leading-tight font-medium">
              <span className="font-bold text-[var(--ib-ink)] dark:text-white mr-1">
                Tip:
              </span>
              Add this certificate to your LinkedIn profile or share it with
              employers to showcase your expertise!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
