"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const billingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  vatId: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingSchema>;

export function BillingInformation() {
  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      fullName: "Fry Nshuti",
      email: "fry@isobrain.ai",
      country: "rwanda",
      city: "Kigali",
      address: "KN 4 Ave, Nyarugenge",
      postalCode: "00000",
      vatId: "",
    },
  });

  const onSubmit = (data: BillingFormValues) => {
    console.log("Billing updated:", data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5 text-slate-800 dark:text-slate-200" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Billing Information
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    Country
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20">
                        <SelectValue placeholder="Enter name..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rwanda">Rwanda</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter street address"
                    className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter postal code"
                      className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    VAT/Tax ID (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your VAT/Tax ID"
                      className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" variant="outline" className="mt-2">
            Update Billing Information
          </Button>
        </form>
      </Form>
    </div>
  );
}
