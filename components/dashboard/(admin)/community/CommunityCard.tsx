"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICommunity } from "@/lib/redux/features/community/communityApi";
import { Edit, MessageCircle, Trash2, Users } from "lucide-react";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  status: ICommunity["status"];       // "ACTIVE" | "ARCHIVED" | "PRIVATE"
  visibility: ICommunity["visibility"]; // "PUBLIC" | "PRIVATE"
  category: string;   // display name
  members: string;
  posts: number;
  icon?: string | null;
  engagement?: string;
  onEdit: () => void;
  onDelete: () => void;

}


const statusLabel: Record<ICommunity["status"], string> = {
  ACTIVE:   "Active",
  PRIVATE:  "Private",
  ARCHIVED: "Archived",
};

const visibilityStyles: Record<ICommunity["visibility"], string> = {
  PUBLIC:  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  PRIVATE: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
};

const CommunityCard = ({
  name,
  description,
  status,
  visibility,
  category,
  members,
  posts,
  icon,
  onEdit,
  onDelete,
}: CommunityCardProps) => {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-7 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 transition-colors overflow-hidden w-12 h-12 flex items-center justify-center shrink-0">
            {icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-6 h-6" />
            )}
          </div>
          <h4 className="text-[18px] font-bold text-slate-900 dark:text-white line-clamp-1">
            {name}
          </h4>
        </div>
        <Badge
          className={cn(
            "rounded-md px-2.5 py-0.5 font-bold text-[12px] border-none shadow-sm uppercase tracking-wider",
            visibilityStyles[visibility],
          )}
        >
          {/* {statusLabel[status]} */}
          {visibility}
        </Badge>
      </div>

      {/* Info Area */}
      <div className="flex-1 mb-6">
        <p className="text-[14px] text-slate-500 line-clamp-2 mb-6">
          {description}
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-100/50 dark:border-slate-800/50">
            <p className="text-[22px] font-black text-indigo-600 dark:text-indigo-400 leading-tight">
              {members}
            </p>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
              Members
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-100/50 dark:border-slate-800/50">
            <p className="text-[22px] font-black text-purple-600 dark:text-purple-400 leading-tight">
              {posts}
            </p>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
              Posts
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-center border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-center">
            <p className="text-[16px] font-extrabold text-emerald-600 dark:text-emerald-400 truncate leading-tight">
              {category}
            </p>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
              Category
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 group/btn text-slate-900 dark:text-white transition-all shadow-sm"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2 group-hover/btn:text-indigo-600 transition-colors" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 shrink-0 transition-all shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 shrink-0 transition-all"
          onClick={onDelete}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CommunityCard;
