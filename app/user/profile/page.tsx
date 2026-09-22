"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import React from "react";
import { ProfileForm } from "@/components/dashboard/(user)/profile/ProfileForm";
import { useGetProfileQuery } from "@/lib/redux/api/userApi";

const ProfilePage = () => {
  const { data: profileResponse, isLoading } = useGetProfileQuery();

  return (
    <Container>
      <div className="space-y-8 pb-10 relative">
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal information and preferences"
        />

        <ProfileForm user={profileResponse?.data} isLoading={isLoading} />
      </div>
    </Container>
  );
};

export default ProfilePage;
