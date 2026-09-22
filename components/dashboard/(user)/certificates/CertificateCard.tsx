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
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row min-h-[220px]">
      {/* Left Banner */}
      <div className="bg-linear-to-br from-[#6B4BFF] to-[#8B4CFF] w-full md:w-72 p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden shrink-0 group-hover:from-[#5a3ae6] group-hover:to-[#7030e6] transition-colors duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
          <Award className="h-16 w-16 text-amber-400 drop-shadow-md" />
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
                <h3 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white">
                  {certificate.courseName}
                </h3>
                {certificate.verified && (
                  <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Instructor: {certificate.instructor}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Issued on:</span>
              <span className="font-black text-slate-900 dark:text-white">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Award className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500 font-medium">
                Certificate ID:
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {certificate.id}
              </span>
            </div>

            {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500 font-medium">
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
        <div className="space-y-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
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
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-bold text-xs h-10 px-4 "
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Size
            </Button>
            <Button
              variant="outline"
              onClick={() => onShare(certificate.id)}
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-bold text-xs h-10 px-4 "
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button> */}
          </div>

          {/* Tip Box */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-3 flex items-start gap-2 border border-blue-100/50 dark:border-blue-800/50">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight font-medium">
              <span className="font-bold text-slate-900 dark:text-white mr-1">
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
