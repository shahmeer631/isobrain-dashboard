"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmailAutomationStats } from "@/components/dashboard/(admin)/email-automation/EmailAutomationStats";
import { EmailTemplateCard } from "@/components/dashboard/(admin)/email-automation/EmailTemplateCard";
import { EmailTemplateModal } from "@/components/dashboard/(admin)/email-automation/EmailTemplateModal";
import Container from "@/components/ui/container";

interface Template {
  id: string;
  name: string;
  description: string;
  subject: string;
  status: "Active" | "Inactive";
  stats: {
    sent: string;
    openRate: string;
    clickRate: string;
  };
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Abandoned Cart Email",
    description:
      "Sent when user adds courses to cart but doesn't complete purchase",
    subject: "Complete your purchase - Your courses are waiting!",
    status: "Active" as const,
    stats: { sent: "847", openRate: "49.9%", clickRate: "22.3%" },
  },
  {
    id: "2",
    name: "Sales Follow-up Email",
    description: "Sent 7 days after purchase to gather feedback",
    subject: "How are you enjoying your ISO Brain courses?",
    status: "Active" as const,
    stats: { sent: "1,234", openRate: "72.3%", clickRate: "36.1%" },
  },
  {
    id: "3",
    name: "Course Welcome Email",
    description: "Sent immediately when user enrolls in a course",
    subject: "Welcome to {{course_name}} - Let's get started!",
    status: "Active" as const,
    stats: { sent: "2,156", openRate: "85.7%", clickRate: "57.2%" },
  },
  {
    id: "4",
    name: "Bundle Welcome Email",
    description: "Sent when user purchases a course bundle",
    subject: "Welcome to {{bundle_name}} - Your learning journey begins!",
    status: "Active" as const,
    stats: { sent: "567", openRate: "86.2%", clickRate: "55.0%" },
  },
  {
    id: "5",
    name: "Course Completion Congratulations",
    description: "Sent when user completes all lessons in a course",
    subject: "🎉 Congratulations on completing {{course_name}}!",
    status: "Active" as const,
    stats: { sent: "892", openRate: "92.3%", clickRate: "63.6%" },
  },
  {
    id: "6",
    name: "Certificate Ready Email",
    description: "Sent when course certificate is generated",
    subject: "Your {{course_name}} certificate is ready!",
    status: "Active" as const,
    stats: { sent: "734", openRate: "93.9%", clickRate: "83.4%" },
  },
];

const EmailAutomationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTemplate, setSelectedTemplate] = useState<{
    name: string;
    subject: string;
    body: string;
    trigger: string;
  } | null>(null);

  const handleCreateNew = () => {
    setModalMode("create");
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setModalMode("edit");
    setSelectedTemplate({
      name: template.name,
      subject: template.subject,
      body: "Hi {{student_name}},\n\nWe noticed you left some courses in your cart!\n\nDon't miss out on your learning journey. Complete your purchase today and get instant access to:\n- Professional certification courses\n- Lifetime access to materials\n- AI-powered learning tools\n- CPD certificates upon completion",
      trigger: "abandoned-cart-1h",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (data: {
    name: string;
    subject: string;
    body: string;
    trigger: string;
  }) => {
    console.log("Submitting template data:", data);
    // In a real app, this would be an API call
  };

  return (
    <Container>
      <PageHeader
        title="Email Automation"
        subtitle="Create and manage automated email campaigns"
        actions={
          <Button
            onClick={handleCreateNew}
            variant={"primary"}
            className="h-12"
          >
            <Plus className="h-5 w-5" />
            Create New Template
          </Button>
        }
      />
<h1 className="text-center text-red-300 text-4xl">this will be removed or updated soon</h1>
      <EmailAutomationStats />

      <div className="grid gap-6">
        {MOCK_TEMPLATES.map((template) => (
          <EmailTemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            subject={template.subject}
            status={template.status}
            stats={template.stats}
            onEdit={() => handleEdit(template)}
            onPreview={() => console.log("Preview", template.id)}
            onDuplicate={() => console.log("Duplicate", template.id)}
          />
        ))}
      </div>

      <EmailTemplateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        initialData={selectedTemplate}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default EmailAutomationPage;
