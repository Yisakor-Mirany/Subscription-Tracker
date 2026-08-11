import type { Metadata } from "next";
import { BarChart3, Hash, TrendingUp, Wallet } from "lucide-react";

import { getSubscriptions } from "@/lib/data/subscriptions";
import { getCurrentProfile } from "@/lib/data/profile";
import {
  activeCount,
  averageMonthlyCost,
  totalAnnualCost,
  totalMonthlyCost,
} from "@/lib/billing";
import { formatCurrency } from "@/lib/format";

import { MetricCard } from "@/components/dashboard/metric-card";
import { MonthlySpendChart } from "@/components/analytics/monthly-spend-chart";
import { CategoryBreakdownChart } from "@/components/analytics/category-breakdown-chart";
import { TopSubscriptionsList } from "@/components/analytics/top-subscriptions-list";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = { title: "Analytics — Subscrio" };

export default async function AnalyticsPage() {
  const profileData = await getCurrentProfile();
  const currency = profileData?.profile?.preferred_currency ?? "USD";

  let subscriptions;
  try {
    subscriptions = await getSubscriptions();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader />
        <ErrorState description="We couldn't load your analytics. Please try again." />
      </div>
    );
  }

  const monthly = totalMonthlyCost(subscriptions);
  const annual = totalAnnualCost(subscriptions);
  const active = activeCount(subscriptions);
  const average = averageMonthlyCost(subscriptions);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monthly spending"
          value={formatCurrency(monthly, currency)}
          icon={Wallet}
        />
        <MetricCard
          label="Annual projected spending"
          value={formatCurrency(annual, currency)}
          icon={TrendingUp}
        />
        <MetricCard
          label="Number of subscriptions"
          value={String(active)}
          hint={`${subscriptions.length} total tracked`}
          icon={Hash}
        />
        <MetricCard
          label="Average subscription cost"
          value={formatCurrency(average, currency)}
          hint="Per month, per active subscription"
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlySpendChart subscriptions={subscriptions} currency={currency} />
        </div>
        <TopSubscriptionsList subscriptions={subscriptions} currency={currency} limit={6} />
      </div>

      <CategoryBreakdownChart subscriptions={subscriptions} currency={currency} />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A closer look at what you spend and where it goes.
      </p>
    </div>
  );
}
