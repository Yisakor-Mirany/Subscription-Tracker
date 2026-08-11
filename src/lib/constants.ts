import {
  Banknote,
  Boxes,
  Clapperboard,
  Cloud,
  Dumbbell,
  GraduationCap,
  Joystick,
  Music,
  Plug,
  ShoppingBag,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { Enums } from "@/types/database.types";

export type SubscriptionCategory = Enums<"subscription_category">;
export type BillingFrequency = Enums<"billing_frequency">;
export type SubscriptionStatus = Enums<"subscription_status">;

export const CATEGORIES: {
  value: SubscriptionCategory;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { value: "entertainment", label: "Entertainment", icon: Clapperboard, color: "var(--chart-1)" },
  { value: "software", label: "Software", icon: Wrench, color: "var(--chart-2)" },
  { value: "ai", label: "AI", icon: Sparkles, color: "var(--chart-3)" },
  { value: "productivity", label: "Productivity", icon: Boxes, color: "var(--chart-4)" },
  { value: "cloud_storage", label: "Cloud Storage", icon: Cloud, color: "var(--chart-5)" },
  { value: "music", label: "Music", icon: Music, color: "var(--chart-6)" },
  { value: "gaming", label: "Gaming", icon: Joystick, color: "var(--chart-1)" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, color: "var(--chart-2)" },
  { value: "finance", label: "Finance", icon: Banknote, color: "var(--chart-3)" },
  { value: "education", label: "Education", icon: GraduationCap, color: "var(--chart-4)" },
  { value: "utilities", label: "Utilities", icon: Plug, color: "var(--chart-5)" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, color: "var(--chart-6)" },
  { value: "other", label: "Other", icon: Boxes, color: "var(--chart-2)" },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.value, c]));

export const BILLING_FREQUENCIES: { value: BillingFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export const SUBSCRIPTION_STATUSES: {
  value: SubscriptionStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "canceled", label: "Canceled" },
  { value: "trial", label: "Trial" },
];

export const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Bank Transfer",
  "Cryptocurrency",
  "Other",
] as const;

export const CURRENCIES = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CAD", label: "Canadian Dollar", symbol: "$" },
  { value: "AUD", label: "Australian Dollar", symbol: "$" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
  { value: "ETB", label: "Ethiopian Birr", symbol: "Br" },
] as const;
