import type { Metadata } from "next";

import { getSubscriptions } from "@/lib/data/subscriptions";
import { getCurrentProfile } from "@/lib/data/profile";

import { AddSubscriptionButton } from "@/components/subscriptions/add-subscription-button";
import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = { title: "Subscriptions — Subscrio" };

export default async function SubscriptionsPage() {
  const profileData = await getCurrentProfile();
  const currency = profileData?.profile?.preferred_currency ?? "USD";

  let subscriptions;
  try {
    subscriptions = await getSubscriptions();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader />
        <ErrorState description="We couldn't load your subscriptions. Please try again." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <SubscriptionList subscriptions={subscriptions} currency={currency} />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage every recurring subscription in one place.
        </p>
      </div>
      <AddSubscriptionButton />
    </div>
  );
}
