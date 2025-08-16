"use client";

import { Switch } from "@/components/ui/switch";
import { PricingCard } from "@/components/pricing-card";
import { useState } from "react";

export function ProCard() {
  const [isYearly, setIsYearly] = useState(true);

  const proFeatures = [
    { text: "All features in Free plan" },
    { text: "Track unlimited repositories" },
    { text: "User/org traffic overview" },
    { text: "Priority support" }
  ];

  return (
    <PricingCard
      title="Pro"
      price={isYearly ? 7.5 : 9}
      period="month"
      features={proFeatures}
      buttonVariant="default"
      middleSection={
        <div className="flex items-center gap-2">
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">Billed yearly</span>
        </div>
      }
    />
  );
}
