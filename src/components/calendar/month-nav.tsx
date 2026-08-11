import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MonthNav({
  year,
  month,
  label,
}: {
  year: number;
  month: number;
  label: string;
}) {
  const prev = month === 0 ? { y: year - 1, m: 11 } : { y: year, m: month - 1 };
  const next = month === 11 ? { y: year + 1, m: 0 } : { y: year, m: month + 1 };

  return (
    <div className="flex items-center gap-2">
      <h1 className="min-w-40 text-2xl font-semibold tracking-tight">{label}</h1>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/calendar?y=${prev.y}&m=${prev.m + 1}`} aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/calendar?y=${next.y}&m=${next.m + 1}`} aria-label="Next month">
            <ChevronRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/calendar">Today</Link>
        </Button>
      </div>
    </div>
  );
}
