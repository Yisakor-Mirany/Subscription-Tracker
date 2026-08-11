import type { Metadata } from "next";

import { getSubscriptions } from "@/lib/data/subscriptions";
import { getCurrentProfile } from "@/lib/data/profile";
import { occurrencesInRange } from "@/lib/billing";

import { MonthNav } from "@/components/calendar/month-nav";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = { title: "Calendar — Subscrio" };

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = parseInt(params.y ?? "", 10) || now.getFullYear();
  const monthParam = parseInt(params.m ?? "", 10);
  const month = monthParam >= 1 && monthParam <= 12 ? monthParam - 1 : now.getMonth();

  const profileData = await getCurrentProfile();
  const currency = profileData?.profile?.preferred_currency ?? "USD";

  let subscriptions;
  try {
    subscriptions = await getSubscriptions();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <MonthNav year={year} month={month} label={monthLabel(year, month)} />
        <ErrorState description="We couldn't load your calendar. Please try again." />
      </div>
    );
  }

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  const occurrences = occurrencesInRange(subscriptions, start, end);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MonthNav year={year} month={month} label={monthLabel(year, month)} />
        <p className="text-sm text-muted-foreground">
          {occurrences.length} {occurrences.length === 1 ? "renewal" : "renewals"} this month
        </p>
      </div>
      <CalendarGrid year={year} month={month} occurrences={occurrences} currency={currency} />
    </div>
  );
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
