"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSaveButton } from "./SettingsSaveButton";
import { ApiUser, useUpdateProfileMutation, useChangePasswordMutation } from "@/lib/redux/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, ShieldCheck, Lock, Eye, EyeOff, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Camera, Loader2 } from "lucide-react";
import NextImage from "next/image";

export function ProfileSettings({
  user,
  isLoading,
}: {
  user?: ApiUser;
  isLoading: boolean;
}) {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Profile State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    profileImage: "",
    currentPlan: "",
  });

  const { uploadFile, isUploading: isFileUploading } = useFileUpload();

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        currentPlan: user.currentPlan || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleProfileSave = async () => {
    if (!user?.id) return;
    
    try {
      const response = await updateProfile({
        id: user.id,
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          bio: formData.bio,
          currentPlan: formData.currentPlan,
          profileImage: formData.profileImage,
        },
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Password changed successfully!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm space-y-8">
           <Skeleton className="h-8 w-48 bg-slate-100 dark:bg-slate-800" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100/50 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-md relative">
                {formData.profileImage ? (
                  <NextImage 
                    src={formData.profileImage} 
                    alt="Profile" 
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20">
                    <User className="w-10 h-10 text-indigo-200 dark:text-indigo-800" />
                  </div>
                )}
                {isFileUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg cursor-pointer transition-all transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <input 
                  id="profile-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  disabled={isFileUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadFile(file);
                      if (url) {
                        setFormData(prev => ({ ...prev, profileImage: url }));
                        toast.success("Profile image uploaded!");
                      }
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium pl-4"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={user?.email || ""}
                disabled
                className="h-12 bg-slate-100/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 rounded-xl font-medium pl-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium pl-11"
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio</Label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="w-full min-h-[100px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-800">
          <SettingsSaveButton onSave={handleProfileSave} isSaving={isUpdating} />
        </div>
      </div>

      {/* Security / Password Change */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
            <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">
            Security & Password
          </h3>
        </div>

        <div className="flex flex-col gap-6 max-w-2xl mb-8">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Password</Label>
            <div className="relative">
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                placeholder="••••••••"
                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-rose-500 font-medium pr-11"
              />
              <button 
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-rose-500 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-rose-500 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-800">
          <Button 
            onClick={handleChangePassword} 
            disabled={isChangingPassword}
            variant="primary"
            className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-blue-500/20"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {/* Account Info (Secondary) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">Account Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${user?.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Status</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{user?.status}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Role</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Joined</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white text-right">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
