"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteAllUserData } from "@/lib/actions/profile";
import { signOutAction } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteData = () => {
    startTransition(async () => {
      const result = await deleteAllUserData();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("All subscription data deleted");
      setOpen(false);
    });
  };

  return (
    <Card className="border-destructive/30 py-0">
      <CardHeader className="border-b border-destructive/20 py-5">
        <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        <CardDescription>Irreversible account actions.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-sm text-muted-foreground">Sign out of Subscrio on this device.</p>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Delete all subscription data</p>
            <p className="text-sm text-muted-foreground">
              Permanently remove every subscription you&apos;ve tracked. Your login
              stays active.
            </p>
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all subscription data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes every subscription in your account. This
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteData}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
