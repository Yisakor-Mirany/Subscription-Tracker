import { CalendarCheck2 } from "lucide-react";

import { daysUntil } from "@/lib/billing";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Tables } from "@/types/database.types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoAvatar } from "@/components/shared/logo-avatar";
import { EmptyState } from "@/components/shared/empty-state";

type Subscription = Tables<"subscriptions">;

export function UpcomingPayments({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[];
  currency: string;
}) {
  const active = subscriptions.filter((s) => s.status !== "canceled");
  const now = new Date();

  const groups = {
    next7: [] as Subscription[],
    next30: [] as Subscription[],
    later: [] as Subscription[],
  };

  for (const s of active) {
    const days = daysUntil(new Date(s.next_billing_date + "T00:00:00"), now);
    if (days < 0) continue;
    if (days <= 7) groups.next7.push(s);
    else if (days <= 30) groups.next30.push(s);
    else groups.later.push(s);
  }

  const sortByDate = (a: Subscription, b: Subscription) =>
    new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime();

  groups.next7.sort(sortByDate);
  groups.next30.sort(sortByDate);
  groups.later.sort(sortByDate);

  const hasAny = groups.next7.length + groups.next30.length + groups.later.length > 0;

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border py-5">
        <CardTitle className="text-base">Upcoming payments</CardTitle>
      </CardHeader>
      <CardContent className="py-5">
        {!hasAny ? (
          <EmptyState
            icon={CalendarCheck2}
            title="Nothing scheduled"
            description="Payments for your active subscriptions will show up here."
            className="border-none py-10"
          />
        ) : (
          <div className="flex flex-col gap-6">
            <PaymentGroup
              title="Next 7 days"
              items={groups.next7}
              currency={currency}
            />
            <PaymentGroup
              title="Next 30 days"
              items={groups.next30}
              currency={currency}
            />
            <PaymentGroup title="Later" items={groups.later} currency={currency} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentGroup({
  title,
  items,
  currency,
}: {
  title: string;
  items: Subscription[];
  currency: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <LogoAvatar
              logoUrl={s.logo_url}
              category={s.category}
              name={s.name}
              className="size-8 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(s.next_billing_date)}
              </p>
            </div>
            <p className="text-sm font-medium">{formatCurrency(s.price, currency)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
