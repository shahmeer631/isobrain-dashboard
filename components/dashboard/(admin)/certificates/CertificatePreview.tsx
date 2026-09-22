import React from "react";
import { cn } from "@/lib/utils";
import { ICreateCertificateRequest } from "@/types/certificateTypes";

interface CertificatePreviewProps {
  data: Partial<ICreateCertificateRequest>;
  className?: string;
}

export function CertificatePreview({ data, className }: CertificatePreviewProps) {
  const getTemplateConfig = () => {
    switch (data.templateType) {
      case "Modern Minimalist":
        return {
          wrapper: "border-slate-100 bg-white",
          accentColor: "text-slate-900",
          secondaryColor: "text-slate-500",
          borderColor: "border-slate-200",
          innerBorder: "border-slate-50",
          icon: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png",
          font: "font-sans",
          decor: null,
        };
      case "Professional Blue":
        return {
          wrapper: "border-blue-100 bg-white",
          accentColor: "text-blue-700",
          secondaryColor: "text-blue-900/60",
          borderColor: "border-blue-600",
          innerBorder: "border-blue-50",
          icon: "https://cdn-icons-png.flaticon.com/512/10543/10543503.png",
          font: "font-serif",
          decor: "bg-blue-600/5",
        };
      case "Corporate Purple":
        return {
          wrapper: "border-purple-100 bg-slate-50",
          accentColor: "text-purple-700",
          secondaryColor: "text-purple-900/60",
          borderColor: "border-purple-600",
          innerBorder: "border-purple-50",
          icon: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
          font: "font-sans",
          decor: "bg-purple-600/10",
        };
      case "Nature Green":
        return {
          wrapper: "border-emerald-100 bg-emerald-50/10",
          accentColor: "text-emerald-700",
          secondaryColor: "text-emerald-900/60",
          borderColor: "border-emerald-500",
          innerBorder: "border-emerald-50",
          icon: "https://cdn-icons-png.flaticon.com/512/591/591605.png",
          font: "font-serif",
          decor: "bg-emerald-500/5",
        };
      case "Elegant Gold":
        return {
          wrapper: "border-amber-400/30 bg-[#0F172A]",
          accentColor: "text-amber-400 font-serif italic",
          secondaryColor: "text-amber-100",
          borderColor: "border-amber-500",
          innerBorder: "border-white/5",
          icon: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png",
          font: "font-serif",
          decor: "bg-gradient-to-br from-amber-500/5 to-transparent",
        };
      default:
        return {
          wrapper: "border-indigo-100 bg-white",
          accentColor: "text-indigo-700",
          secondaryColor: "text-indigo-900/60",
          borderColor: "border-indigo-600",
          innerBorder: "border-indigo-50",
          icon: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png",
          font: "font-sans",
          decor: null,
        };
    }
  };

  const config = getTemplateConfig();

  return (
    <div
      className={cn(
        "relative aspect-297/210 w-full shadow-2xl rounded-sm p-0 flex flex-col items-center justify-between border-8 sm:border-12 overflow-hidden leading-tight",
        config.wrapper,
        config.borderColor,
        className
      )}
    >
      {/* Decorative corners */}
      <div className={cn("absolute top-0 left-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-20", config.accentColor.includes('amber')?'bg-amber-400':'bg-current')} />
      <div className={cn("absolute bottom-0 right-0 w-24 h-24 translate-x-1/2 translate-y-1/2 rotate-45 opacity-20", config.accentColor.includes('amber')?'bg-amber-400':'bg-current')} />

      {/* Inner Border */}
      <div className={cn("absolute inset-2 sm:inset-4 border-2 pointer-events-none opacity-50", config.innerBorder)} />

      {/* Background Decor */}
      {config.decor && <div className={cn("absolute inset-0 pointer-events-none", config.decor)} />}

      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-2 sm:py-6 px-4 sm:px-12 text-center min-h-0">
        {/* Trophy / Logo */}
        <div className="flex flex-col items-center gap-1 shrink-0 pt-2">
          <img
            src={config.icon}
            alt="Award"
            className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm transition-all"
          />
          <div className="h-0.5 w-12 bg-linear-to-r from-transparent via-current to-transparent opacity-20" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 w-full min-h-0 overflow-hidden py-1">
          <h2 className={cn("text-[12px] sm:text-[16px] md:text-[20px] font-bold uppercase tracking-[0.2em] leading-tight", config.accentColor, config.font)}>
            {data.title || "Certificate of Completion"}
          </h2>

          <div className="flex flex-col items-center gap-1 sm:gap-2 w-full min-h-0">
             <p className={cn("text-[9px] sm:text-[11px] md:text-[13px] italic font-serif", config.secondaryColor, "opacity-80")}>
              {data.subtitle || "This certifies that"}
            </p>

            <h1 className={cn("text-[20px] sm:text-[28px] md:text-[38px] font-extrabold tracking-tight leading-none wrap-break-word w-full", config.accentColor)}>
              [Student Name]
            </h1>

            <div className="flex flex-col items-center gap-1 sm:gap-2">
               <p className={cn("text-[7px] sm:text-[9px] md:text-[11px] leading-relaxed max-w-[90%] mx-auto", config.secondaryColor, "opacity-70")}>
                {data.bodyText || "has successfully completed the course requirements for the professional certification of"}
              </p>
              <h3 className={cn("text-[12px] sm:text-[16px] md:text-[18px] font-bold tracking-wide uppercase", config.secondaryColor)}>
                [Course Name]
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Section: Signatures & Footer */}
        <div className="w-full grid grid-cols-3 items-end gap-2 sm:gap-6 pt-2 sm:pt-6 px-2 shrink-0">
          {/* Signature 1 */}
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-full h-px", config.wrapper.includes('bg-[#0F172A]') ? 'bg-amber-400/20' : 'bg-slate-300')} />
            <span className={cn("text-[7px] sm:text-[9px] font-bold uppercase tracking-wider truncate w-full", config.secondaryColor, "opacity-60")}>
              {data.signature1 || "Course Instructor"}
            </span>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col items-center gap-1">
             <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-current flex items-center justify-center text-[6px] sm:text-[8px] italic shrink-0 opacity-20">
               SEAL
             </div>
             <span className={cn("text-[7px] sm:text-[9px] font-bold truncate w-full", config.secondaryColor, "opacity-40", config.font)}>
              {data.footerText || "isobrain.ai"}
            </span>
          </div>

          {/* Signature 2 */}
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-full h-px", config.wrapper.includes('bg-[#0F172A]') ? 'bg-amber-400/20' : 'bg-slate-300')} />
            <span className={cn("text-[7px] sm:text-[9px] font-bold uppercase tracking-wider truncate w-full", config.secondaryColor, "opacity-60")}>
              {data.signature2 || "ISO Brain Director"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

