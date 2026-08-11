"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { subscriptionSchema } from "@/lib/validations/subscription";
import type { Enums, TablesInsert } from "@/types/database.types";

export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function createSubscription(
  input: Record<string, unknown>
): Promise<ActionResult> {
  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors in the form.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const payload: TablesInsert<"subscriptions"> = {
    ...toRow(parsed.data),
    user_id: user.id,
  };

  const { error } = await supabase.from("subscriptions").insert(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

export async function updateSubscription(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors in the form.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("subscriptions")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

export async function deleteSubscription(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

export async function updateSubscriptionStatus(
  id: string,
  status: Enums<"subscription_status">
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

function toRow(data: ReturnType<typeof subscriptionSchema.parse>) {
  return {
    name: data.name,
    description: data.description || null,
    price: data.price,
    billing_frequency: data.billing_frequency,
    next_billing_date: data.next_billing_date,
    category: data.category,
    website: data.website || null,
    payment_method: data.payment_method || null,
    status: data.status,
    notes: data.notes || null,
    logo_url: data.logo_url || null,
  };
}

function flattenFieldErrors(error: {
  issues: { path: (string | number)[]; message: string }[];
}) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
