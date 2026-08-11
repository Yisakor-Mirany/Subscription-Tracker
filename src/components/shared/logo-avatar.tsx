import Image from "next/image";

import { CATEGORY_MAP, type SubscriptionCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LogoAvatar({
  logoUrl,
  category,
  name,
  className,
}: {
  logoUrl?: string | null;
  category: SubscriptionCategory;
  name: string;
  className?: string;
}) {
  const meta = CATEGORY_MAP.get(category);
  const Icon = meta?.icon;

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent text-accent-foreground",
        className
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={name}
          width={40}
          height={40}
          className="size-full object-cover"
          unoptimized
        />
      ) : Icon ? (
        <Icon className="size-5" />
      ) : (
        <span className="text-sm font-semibold">{name[0]?.toUpperCase()}</span>
      )}
    </span>
  );
}
