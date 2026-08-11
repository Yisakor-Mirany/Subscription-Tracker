"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

import { spendByCategory } from "@/lib/billing";
import { CATEGORY_MAP } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Tables } from "@/types/database.types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

type Subscription = Tables<"subscriptions">;

export function CategoryBreakdownChart({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[];
  currency: string;
}) {
  const data = spendByCategory(subscriptions);
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border py-5">
        <CardTitle className="text-base">Spending by category</CardTitle>
        <CardDescription>Monthly-equivalent cost, by category</CardDescription>
      </CardHeader>
      <CardContent className="py-5">
        {data.length === 0 ? (
          <EmptyState
            icon={PieChartIcon}
            title="No data yet"
            className="border-none py-8"
          />
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_MAP.get(entry.category)?.color ?? `var(--chart-${(index % 6) + 1})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [
                      formatCurrency(Number(value), currency),
                      CATEGORY_MAP.get(name as Subscription["category"])?.label ?? "Other",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
              {data.map((entry) => {
                const meta = CATEGORY_MAP.get(entry.category);
                const pct = total > 0 ? Math.round((entry.total / total) * 100) : 0;
                return (
                  <li key={entry.category} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: meta?.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {meta?.label ?? "Other"}
                    </span>
                    <span className="text-muted-foreground">{pct}%</span>
                    <span className="w-20 text-right font-medium">
                      {formatCurrency(entry.total, currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
