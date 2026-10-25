"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

import { useChangePasswordMutation } from "@/lib/redux/api/userApi";
import { toast } from "sonner";
import { useState } from "react";

export function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      const response = await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Password updated successfully!");
        form.reset();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to update password. Please try again.");
    }
  };

  return (
    <div className="ib-card p-6 sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--ib-acc)_16%,var(--ib-line))] bg-[var(--ib-accbg)] text-[var(--ib-acc)]">
          <Lock className="size-4" aria-hidden />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
            Change Password
          </h2>
          <p className="mt-0.5 text-[13px] text-[var(--ib-mute)]">
            Keep your account secure with a strong, unique password.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-xl"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter your current password"
                      className="h-10 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-lg focus:ring-2 focus:ring-blue-600/20 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--ib-mute)] hover:text-[var(--ib-ink)] dark:hover:text-[var(--ib-mute)] transition-colors"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-10 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-lg focus:ring-2 focus:ring-blue-600/20 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--ib-mute)] hover:text-[var(--ib-ink)] dark:hover:text-[var(--ib-mute)] transition-colors"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Must be at least 8 characters with letters, numbers, and
                  symbols
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="h-10 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-lg focus:ring-2 focus:ring-blue-600/20 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--ib-mute)] hover:text-[var(--ib-ink)] dark:hover:text-[var(--ib-mute)] transition-colors"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
                "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
