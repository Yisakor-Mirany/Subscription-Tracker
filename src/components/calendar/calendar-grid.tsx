import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

import { LogoAvatar } from "@/components/shared/logo-avatar";

type Subscription = Tables<"subscriptions">;
type Occurrence = { date: Date; subscription: Subscription };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE = 3;

export function CalendarGrid({
  year,
  month,
  occurrences,
  currency,
}: {
  year: number;
  month: number;
  occurrences: Occurrence[];
  currency: string;
}) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const byDay = new Map<number, Occurrence[]>();
  for (const occ of occurrences) {
    if (occ.date.getFullYear() === year && occ.date.getMonth() === month) {
      const day = occ.date.getDate();
      byDay.set(day, [...(byDay.get(day) ?? []), occ]);
    }
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNumber = i - startWeekday + 1;
          const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          const items = inMonth ? byDay.get(dayNumber) ?? [] : [];
          const isToday = isCurrentMonth && inMonth && dayNumber === today.getDate();

          return (
            <div
              key={i}
              className={cn(
                "min-h-24 border-b border-r border-border p-1.5 last:border-r-0 sm:min-h-28 sm:p-2",
                !inMonth && "bg-muted/20"
              )}
            >
              {inMonth && (
                <>
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {dayNumber}
                  </span>
                  <div className="mt-1 flex flex-col gap-1">
                    {items.slice(0, MAX_VISIBLE).map((occ, idx) => (
                      <div
                        key={`${occ.subscription.id}-${idx}`}
                        title={`${occ.subscription.name} — ${formatCurrency(occ.subscription.price, currency)}`}
                        className="flex items-center gap-1 truncate rounded-md bg-accent px-1.5 py-0.5 text-[11px] text-accent-foreground"
                      >
                        <LogoAvatar
                          logoUrl={occ.subscription.logo_url}
                          category={occ.subscription.category}
                          name={occ.subscription.name}
                          className="size-3.5 shrink-0 rounded-sm bg-transparent"
                        />
                        <span className="truncate">{occ.subscription.name}</span>
                      </div>
                    ))}
                    {items.length > MAX_VISIBLE && (
                      <p className="px-1.5 text-[11px] text-muted-foreground">
                        +{items.length - MAX_VISIBLE} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
