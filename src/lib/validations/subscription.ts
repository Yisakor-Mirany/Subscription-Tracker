import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce
    .number()
    .nonnegative("Price must be positive")
    .max(1_000_000, "Price is too large"),
  billing_frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  next_billing_date: z.string().min(1, "Next billing date is required"),
  category: z.enum([
    "entertainment",
    "software",
    "ai",
    "productivity",
    "cloud_storage",
    "music",
    "gaming",
    "fitness",
    "finance",
    "education",
    "utilities",
    "shopping",
    "other",
  ]),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^https?:\/\/.+\..+/.test(val),
      "Enter a valid URL starting with http(s)://"
    ),
  payment_method: z.string().trim().max(100).optional().or(z.literal("")),
  status: z.enum(["active", "canceled", "trial"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  logo_url: z.string().trim().max(300).optional().or(z.literal("")),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
