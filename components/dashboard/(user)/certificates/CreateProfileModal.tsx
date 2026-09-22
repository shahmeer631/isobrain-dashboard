import React, { useState } from "react";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, Lightbulb } from "lucide-react";

export interface PublicProfileData {
  fullName: string;
  bio: string;
  linkedinUrl: string;
}

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicProfileData) => void;
}

export function CreateProfileModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: "Fry Nshuti",
    bio: "",
    linkedinUrl: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <DashboardModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Create Public Profile"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white">
            Full Name
          </label>
          <Input
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white">
            Professional Bio
          </label>
          <Textarea
            placeholder="e.g., ISO Certified Professional | Quality Management Expert"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="min-h-[100px] resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Link className="h-3.5 w-3.5" />
            LinkedIn Profile URL (Optional)
          </label>
          <Input
            placeholder="https://linkedin.com/in/your-profile"
            value={formData.linkedinUrl}
            onChange={(e) =>
              setFormData({ ...formData, linkedinUrl: e.target.value })
            }
            className="h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>

        {/* Note Box */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 flex items-start gap-2 border border-blue-100/50 dark:border-blue-800/50 mt-4">
          <Lightbulb className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white mr-1">
              Note:
            </span>
            Your public profile will showcase all 5 certificates you&apos;ve
            earned. This profile can be shared with employers, added to your
            resume, or posted on social media.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-[#6B4BFF] hover:bg-[#5a3ae6] text-white font-bold shadow-md shadow-indigo-500/20"
            onClick={handleSubmit}
          >
            Create Profile
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
