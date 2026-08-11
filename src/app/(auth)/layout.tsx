import Link from "next/link";
import { Layers } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="size-4.5" />
          </span>
          Subscrio
        </Link>
        <p className="text-sm text-muted-foreground">
          Know exactly what your subscriptions cost.
        </p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
