import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/data/profile";

import { ProfileForm } from "@/components/settings/profile-form";
import { DarkModeToggle } from "@/components/settings/dark-mode-toggle";
import { DangerZone } from "@/components/settings/danger-zone";

export const metadata: Metadata = { title: "Settings — Subscrio" };

export default async function SettingsPage() {
  const data = await getCurrentProfile();

  if (!data) {
    redirect("/login");
  }

  const { user, profile } = data;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences, and account.
        </p>
      </div>

      <ProfileForm
        fullName={profile?.full_name ?? ""}
        currency={profile?.preferred_currency ?? "USD"}
        email={user.email ?? ""}
      />
      <DarkModeToggle initialDarkMode={profile?.dark_mode ?? false} />
      <DangerZone />
    </div>
  );
}
