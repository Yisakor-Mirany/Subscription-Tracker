"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signInAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AuthActionState = {};

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
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
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!state.fieldErrors?.password}
              required
            />
            {state.fieldErrors?.password && (
              <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
            )}
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
