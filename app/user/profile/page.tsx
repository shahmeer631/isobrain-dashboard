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
      <div className="relative space-y-6 pb-8">
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
