"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings as SettingsIcon,
  ShieldCheck,
  History,
  LogOut,
} from "lucide-react";
import { UserRole } from "@/models/User";
import { Badge } from "@/components/ui/Badge";

interface AdminNavProps {
  userRole: UserRole;
}

export function AdminNav({ userRole }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "EDITOR", "REGISTRATION_MANAGER"],
    },
    {
      label: "Registrations",
      href: "/admin/registrations",
      icon: Users,
      roles: ["SUPER_ADMIN", "REGISTRATION_MANAGER"],
    },
    {
      label: "CMS Pages & Blocks",
      href: "/admin/pages",
      icon: FileText,
      roles: ["SUPER_ADMIN", "EDITOR"],
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      roles: ["SUPER_ADMIN", "EDITOR"],
    },
    {
      label: "Messages Inbox",
      href: "/admin/messages",
      icon: MessageSquare,
      roles: ["SUPER_ADMIN", "EDITOR", "REGISTRATION_MANAGER"],
    },
    {
      label: "Global Settings",
      href: "/admin/settings",
      icon: SettingsIcon,
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Users & RBAC",
      href: "/admin/users",
      icon: ShieldCheck,
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Audit Trail",
      href: "/admin/audit",
      icon: History,
      roles: ["SUPER_ADMIN"],
    },
  ];

  const allowedItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="space-y-4">
      <div className="px-2 py-1 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Navigation
        </span>
        <Badge variant="tech" size="sm" className="text-[9px] py-0">
          {userRole}
        </Badge>
      </div>

      <nav className="space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
