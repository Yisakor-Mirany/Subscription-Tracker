"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, WalletCards } from "lucide-react";

import { CATEGORIES, SUBSCRIPTION_STATUSES } from "@/lib/constants";
import { toMonthlyAmount } from "@/lib/billing";
import type { Tables } from "@/types/database.types";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { AddSubscriptionButton } from "@/components/subscriptions/add-subscription-button";

type Subscription = Tables<"subscriptions">;

type SortKey = "name" | "price_desc" | "price_asc" | "next_billing";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "next_billing", label: "Next billing date" },
  { value: "name", label: "Name (A–Z)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "price_asc", label: "Price (low to high)" },
];

export function SubscriptionList({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[];
  currency: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("next_billing");

  const filtered = useMemo(() => {
    let result = subscriptions;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (category !== "all") {
      result = result.filter((s) => s.category === category);
    }
    if (status !== "all") {
      result = result.filter((s) => s.status === status);
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price_desc":
          return (
            toMonthlyAmount(b.price, b.billing_frequency) -
            toMonthlyAmount(a.price, a.billing_frequency)
          );
        case "price_asc":
          return (
            toMonthlyAmount(a.price, a.billing_frequency) -
            toMonthlyAmount(b.price, b.billing_frequency)
          );
        case "next_billing":
        default:
          return (
            new Date(a.next_billing_date).getTime() -
            new Date(b.next_billing_date).getTime()
          );
      }
    });

    return result;
  }, [subscriptions, search, category, status, sort]);

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        icon={WalletCards}
        title="No subscriptions yet"
        description="Add your first subscription to start tracking what you spend every month."
        action={<AddSubscriptionButton />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions…"
            className="pl-9"
            aria-label="Search subscriptions"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by category">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-36" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {SUBSCRIPTION_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Sort subscriptions">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}
