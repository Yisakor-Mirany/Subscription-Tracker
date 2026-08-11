import type { BillingFrequency } from "@/lib/constants";
import type { Tables } from "@/types/database.types";

type Subscription = Tables<"subscriptions">;

const WEEKS_PER_MONTH = 52 / 12;

/** Converts a price at a given billing frequency to its monthly-equivalent cost. */
export function toMonthlyAmount(price: number, frequency: BillingFrequency): number {
  switch (frequency) {
    case "weekly":
      return price * WEEKS_PER_MONTH;
    case "monthly":
      return price;
    case "quarterly":
      return price / 3;
    case "yearly":
      return price / 12;
  }
}

/** Converts a price at a given billing frequency to its annual-equivalent cost. */
export function toAnnualAmount(price: number, frequency: BillingFrequency): number {
  return toMonthlyAmount(price, frequency) * 12;
}

export function totalMonthlyCost(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status !== "canceled")
    .reduce((sum, s) => sum + toMonthlyAmount(s.price, s.billing_frequency), 0);
}

export function totalAnnualCost(subscriptions: Subscription[]): number {
  return totalMonthlyCost(subscriptions) * 12;
}

export function activeCount(subscriptions: Subscription[]): number {
  return subscriptions.filter((s) => s.status !== "canceled").length;
}

export function averageMonthlyCost(subscriptions: Subscription[]): number {
  const active = subscriptions.filter((s) => s.status !== "canceled");
  if (active.length === 0) return 0;
  return totalMonthlyCost(subscriptions) / active.length;
}

export function spendByCategory(
  subscriptions: Subscription[]
): { category: Subscription["category"]; total: number }[] {
  const totals = new Map<Subscription["category"], number>();
  for (const s of subscriptions) {
    if (s.status === "canceled") continue;
    const monthly = toMonthlyAmount(s.price, s.billing_frequency);
    totals.set(s.category, (totals.get(s.category) ?? 0) + monthly);
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function topSubscriptions(
  subscriptions: Subscription[],
  limit: number = 5
): Subscription[] {
  return [...subscriptions]
    .filter((s) => s.status !== "canceled")
    .sort(
      (a, b) =>
        toMonthlyAmount(b.price, b.billing_frequency) -
        toMonthlyAmount(a.price, a.billing_frequency)
    )
    .slice(0, limit);
}

export function upcomingWithin(
  subscriptions: Subscription[],
  days: number,
  from: Date = new Date()
): Subscription[] {
  return subscriptions
    .filter((s) => s.status !== "canceled")
    .filter((s) => {
      const d = daysUntil(new Date(s.next_billing_date + "T00:00:00"), from);
      return d >= 0 && d <= days;
    });
}

/** Returns the next N occurrences of a subscription's billing date on/after `from`. */
export function nextOccurrences(
  subscription: Subscription,
  from: Date,
  count: number
): Date[] {
  const dates: Date[] = [];
  let current = new Date(subscription.next_billing_date + "T00:00:00");

  const advance = (date: Date) => {
    const next = new Date(date);
    switch (subscription.billing_frequency) {
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "quarterly":
        next.setMonth(next.getMonth() + 3);
        break;
      case "yearly":
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    return next;
  };

  // Fast-forward past dates before `from`.
  let guard = 0;
  while (current < from && guard < 1000) {
    current = advance(current);
    guard++;
  }

  while (dates.length < count) {
    dates.push(new Date(current));
    current = advance(current);
  }

  return dates;
}

/**
 * Projects actual cash outflow per calendar month for the next `monthsAhead`
 * months, accounting for billing frequency (a yearly subscription only
 * appears in the month it renews; a weekly one appears in every month).
 */
export function projectedMonthlySpend(
  subscriptions: Subscription[],
  monthsAhead: number = 6
): { key: string; label: string; total: number }[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);

  const buckets = new Map<string, number>();
  const labels = new Map<string, string>();
  for (let i = 0; i < monthsAhead; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(key, 0);
    labels.set(key, d.toLocaleDateString("en-US", { month: "short" }));
  }

  for (const sub of subscriptions) {
    if (sub.status === "canceled") continue;

    let cursor = new Date(sub.next_billing_date + "T00:00:00");
    let guard = 0;
    while (cursor < start && guard < 1000) {
      cursor = advanceByFrequency(cursor, sub.billing_frequency);
      guard++;
    }

    guard = 0;
    while (cursor < end && guard < 500) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + sub.price);
      }
      cursor = advanceByFrequency(cursor, sub.billing_frequency);
      guard++;
    }
  }

  return Array.from(buckets.entries()).map(([key, total]) => ({
    key,
    label: labels.get(key) ?? key,
    total,
  }));
}

function advanceByFrequency(date: Date, frequency: BillingFrequency): Date {
  const next = new Date(date);
  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

/** Returns every billing occurrence of each subscription that falls within [start, end). */
export function occurrencesInRange(
  subscriptions: Subscription[],
  start: Date,
  end: Date
): { date: Date; subscription: Subscription }[] {
  const results: { date: Date; subscription: Subscription }[] = [];

  for (const sub of subscriptions) {
    if (sub.status === "canceled") continue;

    let cursor = new Date(sub.next_billing_date + "T00:00:00");
    let guard = 0;
    while (cursor < start && guard < 1000) {
      cursor = advanceByFrequency(cursor, sub.billing_frequency);
      guard++;
    }

    guard = 0;
    while (cursor < end && guard < 500) {
      results.push({ date: new Date(cursor), subscription: sub });
      cursor = advanceByFrequency(cursor, sub.billing_frequency);
      guard++;
    }
  }

  return results;
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
