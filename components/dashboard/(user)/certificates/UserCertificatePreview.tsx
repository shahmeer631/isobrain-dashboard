import React from "react";
import { cn } from "@/lib/utils";

interface UserCertificatePreviewProps {
  data: {
    templateType: string;
    title: string;
    subtitle: string;
    bodyText: string;
    signature1: string;
    signature2: string;
    footerText: string;
    studentName: string;
    courseName: string;
    instructorName: string;
  };
  className?: string;
}
const ceo = process.env.NEXT_PUBLIC_CEO;

export const UserCertificatePreview = React.forwardRef<HTMLDivElement, UserCertificatePreviewProps>(
  ({ data, className }, ref) => {
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
        ref={ref}
        className={cn(
          "relative aspect-297/210 shadow-2xl rounded-sm p-0 flex flex-col items-center justify-between border-[16px] overflow-hidden leading-tight",
          config.wrapper,
          config.borderColor,
          className
        )}
        style={{ width: '1123px', height: '794px', minWidth: '1123px', minHeight: '794px' }}
      >
        {/* Decorative corners */}
        <div className={cn("absolute top-0 left-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-20", config.accentColor.includes('amber') ? 'bg-amber-400' : 'bg-current')} />
        <div className={cn("absolute bottom-0 right-0 w-48 h-48 translate-x-1/2 translate-y-1/2 rotate-45 opacity-20", config.accentColor.includes('amber') ? 'bg-amber-400' : 'bg-current')} />

        {/* Inner Border */}
        <div className={cn("absolute inset-4 border-2 pointer-events-none opacity-50", config.innerBorder)} />

        {/* Background Decor */}
        {config.decor && <div className={cn("absolute inset-0 pointer-events-none", config.decor)} />}

        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-8 px-16 text-center">
          {/* Trophy / Logo */}
          <div className="flex flex-col items-center gap-2 shrink-0 pt-4">
            <img
              src={config.icon}
              alt="Award"
              className="w-16 h-16 drop-shadow-sm"
            />
            <div className="h-1 w-16 bg-linear-to-r from-transparent via-current to-transparent opacity-20" />
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
            <h2 className={cn("text-[38px] font-bold uppercase tracking-[0.2em] leading-tight", config.accentColor, config.font)}>
              {data.title || "Certificate of Completion"}
            </h2>

            <div className="flex flex-col items-center gap-3 w-full">
              <p className={cn("text-[20px] italic font-serif", config.secondaryColor, "opacity-80")}>
                {data.subtitle || "This certifies that"}
              </p>

              <h1 className={cn("text-[64px] font-extrabold tracking-tight leading-none", config.accentColor)}>
                {data.studentName}
              </h1>

              <div className="flex flex-col items-center gap-3">
                <p className={cn("text-[18px] leading-relaxed max-w-[85%] mx-auto font-medium", config.secondaryColor, "opacity-70")}>
                  {data.bodyText || "has successfully completed the course requirements for the professional certification of"}
                </p>
                <h3 className={cn("text-[28px] font-bold tracking-wide uppercase", config.secondaryColor)}>
                  {data.courseName}
                </h3>
              </div>
            </div>
          </div>

          {/* Bottom Section: Signatures & Footer */}
          <div className="w-full grid grid-cols-3 items-end gap-12 pt-8 px-4 pb-4">
            {/* Signature 1 (Instructor) */}
            <div className="flex flex-col items-center gap-2">
               <span className={cn("text-[20px] font-bold italic font-serif", config.accentColor)}>
                 {data.instructorName}
               </span>
              <div className={cn("w-full h-px", config.wrapper.includes('bg-[#0F172A]') ? 'bg-amber-400/20' : 'bg-slate-300')} />
              <span className={cn("text-[12px] font-bold uppercase tracking-wider opacity-60", config.secondaryColor)}>
                {data.signature1 || "Course Instructor"}
              </span>
            </div>

            {/* Footer Logo/Seal */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full border border-current flex items-center justify-center text-[14px] italic opacity-20">
                SEAL
              </div>
              <span className={cn("text-[12px] font-bold tracking-widest opacity-40 uppercase", config.secondaryColor, config.font)}>
                {data.footerText || "isobrain.ai"}
              </span>
            </div>

            {/* Signature 2 (Director) */}
            <div className="flex flex-col items-center gap-2">
              <span className={cn("text-[20px] font-bold italic font-serif", config.accentColor)}>
                 {ceo}
               </span>
              <div className={cn("w-full h-px", config.wrapper.includes('bg-[#0F172A]') ? 'bg-amber-400/20' : 'bg-slate-300')} />
              <span className={cn("text-[12px] font-bold uppercase tracking-wider opacity-60", config.secondaryColor)}>
                {data.signature2 || "ISO Brain Director"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

UserCertificatePreview.displayName = "UserCertificatePreview";
