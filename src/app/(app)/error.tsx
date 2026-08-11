"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div>
        <h2 className="text-sm font-semibold">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
