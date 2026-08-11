"use client";

import { useState, useTransition } from "react";
import { CalendarClock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CATEGORY_MAP } from "@/lib/constants";
import { toMonthlyAmount } from "@/lib/billing";
import { formatCurrency, formatDate } from "@/lib/format";
import { updateSubscriptionStatus } from "@/lib/actions/subscriptions";
import type { Tables } from "@/types/database.types";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoAvatar } from "@/components/shared/logo-avatar";
import { StatusBadge } from "@/components/subscriptions/status-badge";
import { SubscriptionFormDialog } from "@/components/subscriptions/subscription-form-dialog";
import { DeleteSubscriptionDialog } from "@/components/subscriptions/delete-subscription-dialog";

type Subscription = Tables<"subscriptions">;

export function SubscriptionCard({
  subscription,
  currency = "USD",
}: {
  subscription: Subscription;
  currency?: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();

  const category = CATEGORY_MAP.get(subscription.category);
  const monthly = toMonthlyAmount(subscription.price, subscription.billing_frequency);

  const setStatus = (status: Subscription["status"]) => {
    startTransition(async () => {
      const result = await updateSubscriptionStatus(subscription.id, status);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Marked as ${status}`);
    });
  };

  return (
    <Card className="gap-4 p-5 py-0 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <LogoAvatar
            logoUrl={subscription.logo_url}
            category={subscription.category}
            name={subscription.name}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{subscription.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {category?.label ?? "Other"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label={`Actions for ${subscription.name}`}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Mark as</DropdownMenuLabel>
            {(["active", "trial", "canceled"] as const)
              .filter((s) => s !== subscription.status)
              .map((s) => (
                <DropdownMenuItem key={s} onSelect={() => setStatus(s)}>
                  {s === "active" ? "Active" : s === "trial" ? "Trial" : "Canceled"}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-end justify-between pb-5">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(subscription.price, currency)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /{FREQUENCY_SHORT[subscription.billing_frequency]}
            </span>
          </p>
          {subscription.billing_frequency !== "monthly" && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              ≈ {formatCurrency(monthly, currency)}/mo
            </p>
          )}
        </div>
        <div className="text-right">
          <StatusBadge status={subscription.status} />
          <p className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDate(subscription.next_billing_date)}
          </p>
        </div>
      </div>

      <SubscriptionFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        subscription={subscription}
      />
      <DeleteSubscriptionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        subscriptionId={subscription.id}
        subscriptionName={subscription.name}
      />
    </Card>
  );
}

const FREQUENCY_SHORT: Record<Subscription["billing_frequency"], string> = {
  weekly: "wk",
  monthly: "mo",
  quarterly: "qtr",
  yearly: "yr",
};
