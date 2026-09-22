"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Video,
  FileText,
  Users,
  BookOpen,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChooseProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const products = [
  {
    title: "Courses",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: GraduationCap,
    colorClass: "border-purple-400 dark:border-purple-500",
    link: "/admin/courses",
  },
  {
    title: "Video Library",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: Video,
    colorClass: "border-green-400 dark:border-green-500",
    link: "/admin/video-library",
  },
  {
    title: "Document Library",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: FileText,
    colorClass: "border-blue-400 dark:border-blue-500",
    link: "/admin/document-library",
  },
  {
    title: "Community",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: Users,
    colorClass: "border-orange-400 dark:border-orange-500",
    link: "/admin/community",
  },
  {
    title: "ISO Standards",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: BookOpen,
    colorClass: "border-indigo-400 dark:border-indigo-500",
    link: "/admin/iso-standards",
  },
  {
    title: "Bundles",
    description:
      "Import your existing content to create on-demand learning experiences",
    icon: Package,
    colorClass: "border-slate-400 dark:border-slate-500",
    link: "/admin/bundles",
  },
];

export function ChooseProductModal({
  open,
  onOpenChange,
}: ChooseProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] p-8 gap-8 rounded-md bg-white dark:bg-slate-900 border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose a product
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              href={product.link}
              key={product.title}
              onClick={() => onOpenChange(false)}
              className={cn(
                "group flex flex-col items-start gap-4 p-6 bg-white dark:bg-slate-950 rounded-md border text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer w-full",
                product.colorClass,
              )}
            >
              <product.icon
                className="h-6 w-6 text-slate-800 dark:text-slate-200"
                strokeWidth={1.5}
              />
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-slate-800 dark:text-slate-100">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug font-medium pr-2">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
