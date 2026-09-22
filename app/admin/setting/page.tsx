"use client";

import React from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileSettings } from "@/components/dashboard/(admin)/settings/ProfileSettings";
import { useGetProfileQuery } from "@/lib/redux/api/userApi";

export default function SettingPage() {
  const { data: profileResponse, isLoading } = useGetProfileQuery();

  return (
    <Container>
      <div className="space-y-8 py-8 relative pb-32">
        <PageHeader
          title="Account Information"
          subtitle="View and manage your profile details and account security"
        />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ProfileSettings 
            user={profileResponse?.data} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </Container>
  );
}