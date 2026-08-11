import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}
