"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SettingsSaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
}

export function SettingsSaveButton({
  onSave,
  isSaving,
}: SettingsSaveButtonProps) {
  return (
    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="h-12 px-8"
        variant={"primary"}
      >
        {isSaving ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
