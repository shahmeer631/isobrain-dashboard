"use client";

import React from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateProfileMutation } from "@/lib/redux/api/userApi";
import { UserProfile } from "@/types/userTypes";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import NextImage from "next/image";

interface ProfilePictureProps {
  user?: UserProfile;
}

export function ProfilePicture({ user }: ProfilePictureProps) {
  const { setValue, watch } = useFormContext();
  const { uploadFile, isUploading } = useFileUpload();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const profileImage = watch("profileImage") || user?.profileImage;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      try {
        const url = await uploadFile(file);
        if (url) {
          // Update the form state
          setValue("profileImage", url, { shouldDirty: true });
          
          // Automatically update the profile in the database
          const response = await updateProfile({
            id: user.id,
            body: {
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              bio: user.bio,
              currentPlan: user.currentPlan,
              profileImage: url,
            },
          }).unwrap();

          if (response.success) {
            toast.success("Profile picture updated successfully!");
          }
        }
      } catch (err) {
        toast.error("Failed to update profile picture. Please try again.");
      }
    }
  };

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "FN";

  return (
    <div className="ib-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--ib-ink)] dark:text-white mb-6">
        Profile Picture
      </h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
        {/* Avatar with Camera Icon */}
        <div className="relative group">
          <div className="h-32 w-32 rounded-[14px] overflow-hidden bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)] ring-4 ring-white dark:ring-[var(--ib-line)] shadow-md relative">
            {profileImage ? (
              <NextImage 
                src={profileImage} 
                alt="Profile" 
                fill 
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--ib-accbg)] text-[var(--ib-acc)] text-3xl font-bold">
                {initials}
              </div>
            )}
            
            {(isUploading || isUpdatingProfile) && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <label 
            htmlFor="user-profile-upload" 
            className="absolute -bottom-3 -right-3 h-10 w-10 bg-[var(--ib-acc)] hover:bg-[var(--ib-acc)]/90 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 cursor-pointer border-4 border-white dark:border-[var(--ib-line)]"
          >
            <Camera className="h-5 w-5" />
            <input 
              id="user-profile-upload"
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading || isUpdatingProfile}
            />
          </label>
        </div>

        {/* Info & Button */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--ib-ink)] dark:text-white">
              Profile Image
            </h3>
            <p className="text-sm text-[var(--ib-mute)] dark:text-[var(--ib-mute)] max-w-[200px] mt-1">
              For best results, use an image at least 256x256 pixels in .jpg or .png format.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            type="button" 
            className="h-10 px-6 font-bold rounded-xl border-[var(--ib-line)] dark:border-[var(--ib-line)]"
            disabled={isUploading || isUpdatingProfile}
            onClick={() => document.getElementById('user-profile-upload')?.click()}
          >
            {isUploading || isUpdatingProfile ? "Updating..." : "Change Picture"}
          </Button>
        </div>
      </div>
    </div>
  );
}
