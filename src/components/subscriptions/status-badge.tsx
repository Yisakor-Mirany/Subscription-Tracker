import { Badge } from "@/components/ui/badge";
import type { SubscriptionStatus } from "@/lib/constants";

const STATUS_VARIANT: Record<
  SubscriptionStatus,
  "success" | "secondary" | "warning"
> = {
  active: "success",
  canceled: "secondary",
  trial: "warning",
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: "Active",
  canceled: "Canceled",
  trial: "Trial",
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
