"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { CertificateStats } from "@/components/dashboard/(user)/certificates/CertificateStats";
import { CertificateCard } from "@/components/dashboard/(user)/certificates/CertificateCard";
import { ShareProfileBanner } from "@/components/dashboard/(user)/certificates/ShareProfileBanner";
import {
  CreateProfileModal,
  PublicProfileData,
} from "@/components/dashboard/(user)/certificates/CreateProfileModal";
import { Button } from "@/components/ui/button";

import {
  useGetUserCertificatesQuery,
  useLazyGetSingleCertificateQuery,
  useLazyDownloadCertificateQuery,
} from "@/lib/redux/features/user/userDashboardApi";
import { UserCertificateCardSkeleton } from "@/components/dashboard/(user)/certificates/UserCertificateSkeleton";
import { useGetProfileQuery } from "@/lib/redux/features/user/userApi";
import { toast } from "sonner";
import { UserCertificatePreview } from "@/components/dashboard/(user)/certificates/UserCertificatePreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { ISingleCertificateData } from "@/types/userDashboardTypes";

export default function UserCertificatesPage() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [downloadingData, setDownloadingData] = useState<ISingleCertificateData | null>(null);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const { data: certsData, isLoading } = useGetUserCertificatesQuery();

  const { data: profileData } = useGetProfileQuery();
  const [triggerFetchSingle] = useLazyGetSingleCertificateQuery();
  const [triggerDownload] = useLazyDownloadCertificateQuery();

  const currentUserName = profileData?.data
    ? `${profileData.data.firstName || ""} ${profileData.data.lastName || ""}`.trim()
    : "Student Name";

  const mappedCertificates: any[] = Array.isArray(certsData?.data)
    ? certsData.data.map((c: any) => ({
        id: c.id,
        courseId: c.courseId,
        courseName: c.course?.title || "Unknown Course",
        instructor: c.course?.instructor || "Unknown Instructor",
        issuedAt: c.issuedAt,
        template: c.template?.name || "Standard Template",
        verified: true,
        studentName: currentUserName,
      }))
    : [];

  // Handlers for certificate actions
  const handleDownload = async (id: string) => {
    try {
      toast.info("Preparing your certificate for download...");
      
      // Call the download API directly with the clicked ID
      const blob = await triggerDownload(id).unwrap();
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const extension = blob.type.includes('pdf') ? 'pdf' : blob.type.includes('png') ? 'png' : 'jpg';
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${id}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificate downloaded successfully!");
    } catch (error: any) {
      console.error("Failed to download certificate:", error);
      if (error?.status === 404) {
        toast.error("No certificate found.");
      } else {
        toast.error("Failed to download certificate. Please try again.");
      }
    }
  };

  const handleShare = (id: string) => {
    console.log(`Sharing certificate: ${id}`);
    // Implement actual sharing logic here
  };

  const handleView = (id: string) => {
    console.log(`Viewing certificate: ${id}`);
    // Implement actual view logic here
  };

  const handleCreateProfile = (data: PublicProfileData) => {
    console.log("Creating profile with data:", data);
    // Implement actual profile creation logic here
  };

  return (
    <Container>
      <div className="space-y-8 pb-10 ">
        <PageHeader
          title="My Certificates"
          subtitle="View and download your earned course certificates"
          actions={
            <Button variant="primary">
              <span className="bg-white/20 rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
                {mappedCertificates.length}
              </span>
              Certificates
            </Button>
          }
        />

        <CertificateStats
          totalCertificates={mappedCertificates.length}
          thisMonth={mappedCertificates.length}
          profileViews={0}
          isLoading={isLoading}
        />

        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map((i) => <UserCertificateCardSkeleton key={i} />)
          ) : mappedCertificates.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 shadow-sm rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-bold">
                No certificates earned yet.
              </p>
            </div>
          ) : (
            mappedCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onDownload={handleDownload}
                onShare={handleShare}
                onView={handleView}
              />
            ))
          )}
        </div>

        {/* <ShareProfileBanner
          onCreateProfile={() => setIsProfileModalOpen(true)}
        /> */}

        <CreateProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSubmit={handleCreateProfile}
        />

        {/* Hidden Render-only Certificate Container */}
        {downloadingData && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <UserCertificatePreview
              ref={certificateRef}
              data={{
                templateType: downloadingData.template.templateType,
                title: downloadingData.template.title,
                subtitle: downloadingData.template.subtitle,
                bodyText: downloadingData.template.bodyText,
                signature1: downloadingData.template.signature1,
                signature2: downloadingData.template.signature2,
                footerText: downloadingData.template.footerText,
                studentName: currentUserName,
                courseName: downloadingData.course.title,
                instructorName: downloadingData.course.instructor,
              }}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
