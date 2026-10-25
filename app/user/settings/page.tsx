"use client";

import React from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { ChangePassword } from "@/components/dashboard/(user)/settings/ChangePassword";
import { BillingInformation } from "@/components/dashboard/(user)/settings/BillingInformation";
import { PaymentMethods } from "@/components/dashboard/(user)/settings/PaymentMethods";

export default function UserSettingsPage() {
  return (
    <Container>
      <div className="flex flex-col gap-6 pb-8">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your password, billing, and payment information"
        />

        <div className="grid max-w-4xl grid-cols-1 gap-5">
          <ChangePassword />
          <BillingInformation />
          <PaymentMethods />
          {/* Preserved dormant sections — PaymentPlans, OrderHistory */}
        </div>
      </div>
    </Container>
  );
}
