import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("gap-3 p-5 py-0", className)}>
      <div className="flex items-center justify-between pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="pb-5">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
