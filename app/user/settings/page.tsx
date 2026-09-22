"use client";

import React from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { ChangePassword } from "@/components/dashboard/(user)/settings/ChangePassword";
import { BillingInformation } from "@/components/dashboard/(user)/settings/BillingInformation";
import { PaymentMethods } from "@/components/dashboard/(user)/settings/PaymentMethods";
import { PaymentPlans } from "@/components/dashboard/(user)/settings/PaymentPlans";
import { OrderHistory } from "@/components/dashboard/(user)/settings/OrderHistory";

export default function UserSettingsPage() {
  return (
    <Container>
      <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your password, billing, and payment information"
        />

        <div className="grid grid-cols-1 gap-6 max-w-8xl">
          <ChangePassword />
          <BillingInformation />
          <PaymentMethods />
          {/* <PaymentPlans /> */}
          {/* <OrderHistory /> */}
        </div>
      </div>
    </Container>
  );
}
