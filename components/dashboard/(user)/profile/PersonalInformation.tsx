"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { User, Mail, Phone } from "lucide-react";

export function PersonalInformation() {
  const { control } = useFormContext();

  return (
    <div className="ib-card p-6 sm:p-7">
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Personal Information
        </h2>
        <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
          Update the details associated with your ISOBrain.AI account.
        </p>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--ib-mute)]" />
                First Name *
              </FormLabel>
              <FormControl>
                <Input placeholder="E.g. John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--ib-mute)]" />
                Last Name *
              </FormLabel>
              <FormControl>
                <Input placeholder="E.g. Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--ib-mute)]" />
                Email Address *
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--ib-mute)]" />
                Phone Number
              </FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 234 567 890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about yourself..."
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
