import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
