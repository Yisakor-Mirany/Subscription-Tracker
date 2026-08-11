"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  subscriptionSchema,
  type SubscriptionFormValues,
} from "@/lib/validations/subscription";
import {
  createSubscription,
  updateSubscription,
} from "@/lib/actions/subscriptions";
import {
  BILLING_FREQUENCIES,
  CATEGORIES,
  PAYMENT_METHODS,
  SUBSCRIPTION_STATUSES,
} from "@/lib/constants";
import type { Tables } from "@/types/database.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Subscription = Tables<"subscriptions">;

const DEFAULT_VALUES: SubscriptionFormValues = {
  name: "",
  description: "",
  price: 0,
  billing_frequency: "monthly",
  next_billing_date: new Date().toISOString().slice(0, 10),
  category: "other",
  website: "",
  payment_method: "",
  status: "active",
  notes: "",
  logo_url: "",
};

function toFormValues(subscription: Subscription): SubscriptionFormValues {
  return {
    name: subscription.name,
    description: subscription.description ?? "",
    price: subscription.price,
    billing_frequency: subscription.billing_frequency,
    next_billing_date: subscription.next_billing_date,
    category: subscription.category,
    website: subscription.website ?? "",
    payment_method: subscription.payment_method ?? "",
    status: subscription.status,
    notes: subscription.notes ?? "",
    logo_url: subscription.logo_url ?? "",
  };
}

export function SubscriptionFormDialog({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription;
  onSuccess?: () => void;
}) {
  const isEditing = !!subscription;
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription ? toFormValues(subscription) : DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(subscription ? toFormValues(subscription) : DEFAULT_VALUES);
    }
  }, [open, subscription, reset]);

  const onSubmit = (values: SubscriptionFormValues) => {
    startTransition(async () => {
      const result = isEditing
        ? await updateSubscription(subscription.id, values)
        : await createSubscription(values);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof SubscriptionFormValues, { message });
          }
        }
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Subscription updated" : "Subscription added");
      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit subscription" : "Add subscription"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this subscription."
              : "Track a new recurring subscription."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Netflix" aria-invalid={!!errors.name} {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                aria-invalid={!!errors.price}
                {...register("price")}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="billing_frequency">Billing frequency</Label>
              <Select
                value={watch("billing_frequency")}
                onValueChange={(v) =>
                  setValue("billing_frequency", v as SubscriptionFormValues["billing_frequency"])
                }
              >
                <SelectTrigger id="billing_frequency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="next_billing_date">Next billing date</Label>
              <Input
                id="next_billing_date"
                type="date"
                aria-invalid={!!errors.next_billing_date}
                {...register("next_billing_date")}
              />
              {errors.next_billing_date && (
                <p className="text-xs text-destructive">{errors.next_billing_date.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(v) =>
                  setValue("category", v as SubscriptionFormValues["category"])
                }
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) =>
                  setValue("status", v as SubscriptionFormValues["status"])
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="payment_method">Payment method</Label>
              <Select
                value={watch("payment_method") || undefined}
                onValueChange={(v) => setValue("payment_method", v)}
              >
                <SelectTrigger id="payment_method" className="w-full">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://netflix.com"
                aria-invalid={!!errors.website}
                {...register("website")}
              />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="logo_url">Logo URL (optional)</Label>
              <Input id="logo_url" placeholder="https://…/logo.png" {...register("logo_url")} />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...register("description")} />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={2} {...register("notes")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isEditing ? "Save changes" : "Add subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
