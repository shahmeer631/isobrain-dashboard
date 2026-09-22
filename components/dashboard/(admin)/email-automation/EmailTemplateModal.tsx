"use client";

import React from "react";
import { DashboardModal } from "../../DashboardModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: {
    name: string;
    subject: string;
    body: string;
    trigger: string;
  } | null;
  onSubmit: (data: {
    name: string;
    subject: string;
    body: string;
    trigger: string;
  }) => void;
}

export function EmailTemplateModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: EmailTemplateModalProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    subject: initialData?.subject || "",
    body: initialData?.body || "",
    trigger: initialData?.trigger || "abandoned-cart-1h",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        subject: "",
        body: "",
        trigger: "abandoned-cart-1h",
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create" ? "Create New Email Template" : "Edit Email Template"
      }
      maxWidth="sm:max-w-[700px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Template Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Abandoned Cart Email"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-11 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold">
              Email Subject
            </Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="h-11 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              required
            />
            <p className="text-[11px] text-slate-400">
              Available variables:{" "}
              <code className="text-blue-500 font-mono">
                {"{{ student_name }}"}
              </code>
              ,{" "}
              <code className="text-blue-500 font-mono">
                {"{{ course_name }}"}
              </code>
              ,{" "}
              <code className="text-blue-500 font-mono">
                {"{{ bundle_name }}"}
              </code>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-semibold">
              Email Body
            </Label>
            <Textarea
              id="body"
              placeholder="Enter email body"
              rows={10}
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className="bg-slate-50 border-slate-100 focus:bg-white transition-all resize-none leading-relaxed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger" className="text-sm font-semibold">
              Send Trigger
            </Label>
            <Select
              value={formData.trigger}
              onValueChange={(value) =>
                setFormData({ ...formData, trigger: value })
              }
            >
              <SelectTrigger className="h-11 w-full bg-slate-50 border-slate-100 focus:bg-white transition-all">
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abandoned-cart-1h">
                  When cart is abandoned for 1 hour
                </SelectItem>
                <SelectItem value="course-enrollment">
                  Immediately when user enrolls in a course
                </SelectItem>
                <SelectItem value="bundle-purchase">
                  When user purchases a course bundle
                </SelectItem>
                <SelectItem value="course-completion">
                  When user completes all lessons in a course
                </SelectItem>
                <SelectItem value="certificate-ready">
                  When course certificate is generated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button type="submit" variant={"primary"} className="h-12">
            {mode === "create" ? "Create Template" : "Save Template"}
          </Button>
        </div>
      </form>
    </DashboardModal>
  );
}
