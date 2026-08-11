"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { projectedMonthlySpend } from "@/lib/billing";
import { formatCurrency } from "@/lib/format";
import type { Tables } from "@/types/database.types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Subscription = Tables<"subscriptions">;

export function MonthlySpendChart({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[];
  currency: string;
}) {
  const data = projectedMonthlySpend(subscriptions, 6);

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border py-5">
        <CardTitle className="text-base">Monthly spending</CardTitle>
        <CardDescription>Projected cash outflow for the next 6 months</CardDescription>
      </CardHeader>
      <CardContent className="py-5">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={56}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                formatter={(value) => [formatCurrency(Number(value), currency), "Spend"]}
              />
              <Bar dataKey="total" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
