"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { ProfilePicture } from "@/components/dashboard/(user)/profile/ProfilePicture";
import { PersonalInformation } from "@/components/dashboard/(user)/profile/PersonalInformation";
import { Preferences } from "@/components/dashboard/(user)/profile/Preferences";
import { EmailNotifications } from "@/components/dashboard/(user)/profile/EmailNotifications";
import { useUpdateProfileMutation } from "@/lib/redux/api/userApi";
import { UserProfile } from "@/types/userTypes";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  courseUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(true),
  weeklyProgress: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user?: UserProfile;
  isLoading?: boolean;
}

export function ProfileForm({ user, isLoading }: ProfileFormProps) {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      bio: "",
      language: "en",
      timezone: "UTC",
      courseUpdates: true,
      marketingEmails: true,
      weeklyProgress: false,
    },
  });

  // Sync form with user data when it arrives
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        language: user.preferredLanguage || "en",
        timezone: user.timezone || "UTC",
        courseUpdates: user.courseUpdates ?? true,
        marketingEmails: user.marketingEmails ?? true,
        weeklyProgress: user.weeklyProgressReport ?? false,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;

    try {
      const response = await updateProfile({
        id: user.id,
        body: {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          bio: values.bio,
          preferredLanguage: values.language,
          timezone: values.timezone,
          courseUpdates: values.courseUpdates,
          marketingEmails: values.marketingEmails,
          weeklyProgressReport: values.weeklyProgress,
          currentPlan: user.currentPlan,
          profileImage: user.profileImage,
        },
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">
        <ProfilePicture user={user} />
        <PersonalInformation />
        <div className="hidden">
          <Preferences />
          <EmailNotifications />
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="submit"
            className="gap-2 h-12 px-8 rounded-xl font-bold shadow-lg shadow-blue-500/20 text-white"
            variant={"primary"}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
