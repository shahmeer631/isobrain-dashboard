/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { Users, RefreshCw } from "lucide-react";
import { ICommunity } from "@/lib/redux/features/community/communityApi";
import { useGetCategoriesQuery } from "@/lib/redux/features/community/communityApi";

// EditCommunityModal accepts ICommunity directly
type EditableCommunity = ICommunity;

const formSchema = z.object({
  name: z.string().min(2, "Community name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  visibility: z.string().min(1, "Please select visibility"),
  allowMemberPosts: z.boolean(),
  requireApproval: z.boolean(),
  allowAttachments: z.boolean(),
  sendNotifications: z.boolean(),
  moderators: z.string().optional(),
  memberLimit: z.string().optional(),
  rules: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCommunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  community: EditableCommunity;
  onSubmit: (data: any) => void;
}

export function EditCommunityModal({
  open,
  onOpenChange,
  community,
  onSubmit,
}: EditCommunityModalProps) {
  // ✅ Fetch categories from backend
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const categories = categoriesResponse?.data ?? [];

  // Icon upload state
  const [iconPreview, setIconPreview] = useState<string | null>(
    community.icon ?? null
  );
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIconPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: community.name,
      description: community.description,
      // ✅ Use categoryId if available, fallback to category name
      category: community.categoryId ?? community.category,
      visibility:
        community.status === "ACTIVE"
          ? "Public"
          : "Private",
      allowMemberPosts: community.allowPosts ?? true,
      requireApproval: community.requireApproval ?? false,
      allowAttachments: community.allowAttachments ?? true,
      sendNotifications: community.emailNotifications ?? true,
      moderators: Array.isArray(community.moderators)
        ? community.moderators.join(", ")
        : "",
      memberLimit: community.memberLimit?.toString() ?? "",
      rules: community.rules ?? "",
    },
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      // ✅ Pass flat values to parent — parent handles API call & modal close
      onSubmit({
        id: community.id,
        name: values.name,
        description: values.description,
        category: values.category,
        visibility: values.visibility,
        allowMemberPosts: values.allowMemberPosts,
        requireApproval: values.requireApproval,
        allowAttachments: values.allowAttachments,
        sendNotifications: values.sendNotifications,
        moderators: values.moderators,
        memberLimit: values.memberLimit,
        rules: values.rules,
        icon: iconPreview ?? undefined,
      });
      // ❌ No onOpenChange(false) here — parent closes on API success
    },
    [onSubmit, community, iconPreview],
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Community"
      maxWidth="max-w-4xl!"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-8">
            {/* Community Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-10 text-[14px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    Community Name <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ISO 9001 Quality Professionals"
                      className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    Description <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the community purpose..."
                      className="min-h-[100px] bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl resize-none focus:ring-1 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ✅ Category — mapped from backend */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl">
                          <SelectValue
                            placeholder={
                              categoriesLoading
                                ? "Loading categories..."
                                : "Select Category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No categories found
                          </SelectItem>
                        ) : (
                          // ✅ value = category ID (sent to backend)
                          // label = category name (shown to user)
                          categories.map((cat: any) => (
                            <SelectItem
                              key={cat._id ?? cat.id}
                              value={cat._id ?? cat.id}
                              className="rounded-lg py-3 focus:bg-indigo-50"
                            >
                              {cat.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visibility */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Visibility
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl">
                          <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                        {["Public", "Private"].map((v) => (
                          <SelectItem
                            key={v}
                            value={v}
                            className="rounded-lg py-3 focus:bg-indigo-50"
                          >
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Community Statistics Preview */}
            <div className="space-y-4">
              <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                Community Statistics
              </p>
              <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[22px] font-black text-indigo-600 dark:text-indigo-400 leading-none font-sans">
                    {community.membersCount ?? 0}
                  </p>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight mt-1">
                    Members
                  </p>
                </div>
                <div>
                  <p className="text-[22px] font-black text-purple-600 dark:text-purple-400 leading-none font-sans">
                    {community.postsCount ?? 0}
                  </p>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight mt-1">
                    Posts
                  </p>
                </div>
                <div>
                  <p className="text-[22px] font-black text-emerald-600 dark:text-emerald-400 leading-none font-sans">
                    {community.engagement || "High"}
                  </p>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight mt-1">
                    Engagement
                  </p>
                </div>
              </div>
            </div>

            {/* Icon Change Area */}
            <div className="space-y-3">
              <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                Community Icon
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden cursor-pointer border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 transition-colors"
                  onClick={() => iconInputRef.current?.click()}
                >
                  {iconPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconPreview} alt="community icon" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8" />
                  )}
                </div>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconChange}
                />
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl h-10 border-slate-200 dark:border-slate-800 font-bold px-6"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Change Icon
                  </Button>
                  {iconPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setIconPreview(null);
                        if (iconInputRef.current) iconInputRef.current.value = "";
                      }}
                      className="text-xs text-rose-500 hover:underline text-left"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-slate-400">PNG, JPG, GIF up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Community Settings */}
            <div className="space-y-4 pt-2">
              <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                Community Settings
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[24px] border border-slate-100 dark:border-slate-800/50">
                <FormField
                  control={form.control}
                  name="allowMemberPosts"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <FormLabel className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        Allow members to create posts
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <FormLabel className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        Require moderator approval for posts
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowAttachments"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <FormLabel className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        Allow file attachments
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sendNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <FormLabel className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                        Send email notifications to members
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Moderators */}
              <FormField
                control={form.control}
                name="moderators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Moderators
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add moderator emails..."
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Member Limit */}
              <FormField
                control={form.control}
                name="memberLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Member Limit
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Unlimited"
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Community Rules */}
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                    Community Rules
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List community guidelines and rules..."
                      className="min-h-[100px] bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-xl resize-none focus:ring-1 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-[15px] hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 h-12 rounded-xl font-bold text-[15px] shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </DashboardModal>
  );
}
