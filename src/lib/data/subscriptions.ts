import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export async function getSubscriptions(): Promise<Tables<"subscriptions">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("next_billing_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
