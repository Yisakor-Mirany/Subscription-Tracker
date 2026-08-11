"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteSubscription } from "@/lib/actions/subscriptions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteSubscriptionDialog({
  open,
  onOpenChange,
  subscriptionId,
  subscriptionName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  subscriptionName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSubscription(subscriptionId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Subscription deleted");
      onOpenChange(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {subscriptionName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this subscription and its history. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
