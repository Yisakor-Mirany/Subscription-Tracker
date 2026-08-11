"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/lib/actions/auth";
import { initials } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <Avatar className="size-8">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
            {initials(name || email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {name || "Your account"}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction} className="w-full">
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full">
              <LogOut />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
