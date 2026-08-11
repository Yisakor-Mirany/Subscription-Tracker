"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { signUpAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  if (state.success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
            <MailCheck className="size-6" />
          </span>
          <h2 className="text-lg font-semibold">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to your email. Confirm your address to finish
            creating your account.
          </p>
          <Link href="/login" className="mt-2 text-sm font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>Start tracking your subscriptions in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!state.fieldErrors?.fullName}
              required
            />
            {state.fieldErrors?.fullName && (
              <p className="text-xs text-destructive">{state.fieldErrors.fullName}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!state.fieldErrors?.email}
              required
            />
            {state.fieldErrors?.email && (
              <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!state.fieldErrors?.password}
              required
            />
            {state.fieldErrors?.password && (
              <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={!!state.fieldErrors?.confirmPassword}
              required
            />
            {state.fieldErrors?.confirmPassword && (
              <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
            )}
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
