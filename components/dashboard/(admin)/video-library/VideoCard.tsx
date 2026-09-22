"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IVideo } from "@/types/videoTypes";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { MdOutlinePlayArrow } from "react-icons/md";

interface VideoCardProps extends Pick<IVideo, "id" | "title" | "duration" | "description" | "thumbnail"> {
  category?: string;
  status: string;
  views: string;
  uploadedAt: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function VideoCard({
  title,
  description,
  status,
  duration,
  views,
  thumbnail,
  onEdit,
  onDelete,
  onClick,
}: VideoCardProps) {
  const isValidUrl = (url: string) => {
    try {
      return url.startsWith("/") || url.startsWith("http");
    } catch {
      return false;
    }
  };

  return (
    <div 
      className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 xl:p-6 shadow-sm hover:shadow-md transition-all group h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video rounded-lg bg-linear-to-br from-blue-500 to-purple-600 mb-6 flex items-center justify-center overflow-hidden">
        {thumbnail && isValidUrl(thumbnail) ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : null}
        <MdOutlinePlayArrow className="w-12 h-12 text-white fill-white ml-1 relative z-10 drop-shadow-lg" />
      </div>

      {/* Info Area */}
      <div className="flex-1 mb-6">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h4 className="text-[17px] font-bold text-slate-900 dark:text-white line-clamp-1">
            {title}
          </h4>
          <Badge
            className={cn(
              "rounded-lg px-2.5 py-1 font-bold text-[10px] border-none shadow-sm uppercase tracking-wider shrink-0",
              status === "Published"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500",
            )}
          >
            {status}
          </Badge>
        </div>
        <p className="text-[13px] font-semibold text-slate-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
              Duration
            </p>
            <p className="text-[14px] font-bold text-slate-900 dark:text-white">
              {duration}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">
              Views
            </p>
            <p className="text-[14px] font-bold text-slate-900 dark:text-white">
              {views}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-md border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 group/btn text-slate-900 dark:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-indigo-600 transition-colors" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
