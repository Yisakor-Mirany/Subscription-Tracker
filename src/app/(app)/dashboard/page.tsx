import type { Metadata } from "next";
import { CalendarClock, CreditCard, TrendingUp, Wallet } from "lucide-react";

import { getSubscriptions } from "@/lib/data/subscriptions";
import { getCurrentProfile } from "@/lib/data/profile";
import { activeCount, totalAnnualCost, totalMonthlyCost, upcomingWithin } from "@/lib/billing";
import { formatCurrency } from "@/lib/format";

import { MetricCard } from "@/components/dashboard/metric-card";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { MonthlySpendChart } from "@/components/analytics/monthly-spend-chart";
import { CategoryBreakdownChart } from "@/components/analytics/category-breakdown-chart";
import { TopSubscriptionsList } from "@/components/analytics/top-subscriptions-list";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = { title: "Dashboard — Subscrio" };

export default async function DashboardPage() {
  const profileData = await getCurrentProfile();
  const currency = profileData?.profile?.preferred_currency ?? "USD";
  const name = profileData?.profile?.full_name?.split(" ")[0];

  let subscriptions;
  try {
    subscriptions = await getSubscriptions();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader name={name} />
        <ErrorState description="We couldn't load your dashboard data. Please try again." />
      </div>
    );
  }

  const monthly = totalMonthlyCost(subscriptions);
  const annual = totalAnnualCost(subscriptions);
  const active = activeCount(subscriptions);
  const upcoming30 = upcomingWithin(subscriptions, 30);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader name={name} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monthly cost"
          value={formatCurrency(monthly, currency)}
          hint="Across all active subscriptions"
          icon={Wallet}
        />
        <MetricCard
          label="Annual cost"
          value={formatCurrency(annual, currency)}
          hint="Estimated for the next 12 months"
          icon={TrendingUp}
        />
        <MetricCard
          label="Active subscriptions"
          value={String(active)}
          hint={`${subscriptions.length} total tracked`}
          icon={CreditCard}
        />
        <MetricCard
          label="Upcoming charges"
          value={String(upcoming30.length)}
          hint="Due in the next 30 days"
          icon={CalendarClock}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <MonthlySpendChart subscriptions={subscriptions} currency={currency} />
          <CategoryBreakdownChart subscriptions={subscriptions} currency={currency} />
        </div>
        <div className="flex flex-col gap-4">
          <UpcomingPayments subscriptions={subscriptions} currency={currency} />
          <TopSubscriptionsList subscriptions={subscriptions} currency={currency} limit={4} />
        </div>
      </div>
    </div>
  );
}

function PageHeader({ name }: { name?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {name ? `Welcome back, ${name}` : "Dashboard"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s what your subscriptions are costing you.
      </p>
    </div>
  );
}
