"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { setDarkModePreference } from "@/lib/actions/profile";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DarkModeToggle({ initialDarkMode }: { initialDarkMode: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydration-safe mount guard: `resolvedTheme` is undefined on the server,
    // so we fall back to the persisted DB preference until the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : initialDarkMode;

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    setDarkModePreference(checked).catch(() => {
      toast.error("Couldn't save your theme preference");
    });
  };

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border py-5">
        <CardTitle className="text-base">Appearance</CardTitle>
        <CardDescription>Customize how Subscrio looks on this device.</CardDescription>
      </CardHeader>
      <CardContent className="py-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="text-sm font-normal">
            Dark mode
          </Label>
          <Switch id="dark-mode" checked={isDark} onCheckedChange={handleToggle} />
        </div>
      </CardContent>
    </Card>
  );
}
