import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  preferred_currency: z.string().trim().min(3).max(3),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
