import { Trophy } from "lucide-react";

import { toMonthlyAmount, topSubscriptions } from "@/lib/billing";
import { formatCurrency } from "@/lib/format";
import type { Tables } from "@/types/database.types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogoAvatar } from "@/components/shared/logo-avatar";
import { EmptyState } from "@/components/shared/empty-state";

type Subscription = Tables<"subscriptions">;

export function TopSubscriptionsList({
  subscriptions,
  currency,
  limit = 5,
}: {
  subscriptions: Subscription[];
  currency: string;
  limit?: number;
}) {
  const top = topSubscriptions(subscriptions, limit);
  const max = top.length
    ? Math.max(...top.map((s) => toMonthlyAmount(s.price, s.billing_frequency)))
    : 0;

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border py-5">
        <CardTitle className="text-base">Most expensive subscriptions</CardTitle>
        <CardDescription>Ranked by monthly-equivalent cost</CardDescription>
      </CardHeader>
      <CardContent className="py-5">
        {top.length === 0 ? (
          <EmptyState icon={Trophy} title="No active subscriptions" className="border-none py-8" />
        ) : (
          <ul className="flex flex-col gap-4">
            {top.map((s) => {
              const monthly = toMonthlyAmount(s.price, s.billing_frequency);
              const pct = max > 0 ? Math.round((monthly / max) * 100) : 0;
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <LogoAvatar
                    logoUrl={s.logo_url}
                    category={s.category}
                    name={s.name}
                    className="size-8 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{s.name}</span>
                      <span className="shrink-0 font-medium">
                        {formatCurrency(monthly, currency)}/mo
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
