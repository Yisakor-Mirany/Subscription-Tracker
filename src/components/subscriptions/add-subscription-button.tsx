"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubscriptionFormDialog } from "@/components/subscriptions/subscription-form-dialog";

export function AddSubscriptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add subscription
      </Button>
      <SubscriptionFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
