import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: Wallet },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];
