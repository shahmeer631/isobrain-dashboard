"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Globe, Bell, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-components
import { GeneralSettings } from "@/components/dashboard/(admin)/settings/GeneralSettings";
import { NotificationSettings } from "@/components/dashboard/(admin)/settings/NotificationSettings";
import { SecuritySettings } from "@/components/dashboard/(admin)/settings/SecuritySettings";
import { BillingSettings } from "@/components/dashboard/(admin)/settings/BillingSettings";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: Wallet },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    // <Container>
    //   <div className="space-y-8 py-8 relative pb-32">
    //     <PageHeader
    //       title="Settings"
    //       subtitle="Manage platform configuration and preferences"
    //     />

    //     {/* Tab Navigation */}
    //     <div className="flex items-center gap-8 border-b border-slate-100 dark:border-slate-800">
    //       {TABS.map((tab) => {
    //         const Icon = tab.icon;
    //         const isActive = activeTab === tab.id;
    //         return (
    //           <button
    //             key={tab.id}
    //             onClick={() => setActiveTab(tab.id)}
    //             className={cn(
    //               "flex items-center gap-2 py-4 px-1 text-[15px] font-bold transition-all relative",
    //               isActive
    //                 ? "text-indigo-600 dark:text-indigo-400"
    //                 : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
    //             )}
    //           >
    //             <Icon
    //               className={cn(
    //                 "w-4 h-4",
    //                 isActive ? "text-indigo-600" : "text-slate-400",
    //               )}
    //             />
    //             {tab.label}
    //             {isActive && (
    //               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
    //             )}
    //           </button>
    //         );
    //       })}
    //     </div>

    //     {/* Tab Content */}
    //     <div className="">
    //       {activeTab === "general" && (
    //         <GeneralSettings onSave={handleSave} isSaving={isSaving} />
    //       )}
    //       {activeTab === "notifications" && (
    //         <NotificationSettings onSave={handleSave} isSaving={isSaving} />
    //       )}
    //       {activeTab === "security" && (
    //         <SecuritySettings onSave={handleSave} isSaving={isSaving} />
    //       )}
    //       {activeTab === "billing" && (
    //         <BillingSettings onSave={handleSave} isSaving={isSaving} />
    //       )}
    //     </div>
    //   </div>
    // </Container>
  <div></div>
  );
}
