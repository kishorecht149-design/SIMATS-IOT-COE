import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentSession } from "@/lib/services/auth-service";
import { AdminNav } from "./components/AdminNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ExternalLink } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {session ? (
        <>
          {/* Admin Sidebar */}
          <aside className="w-full md:w-64 border-r border-border bg-card/70 flex-shrink-0 flex flex-col justify-between">
            <div>
              {/* Brand Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 rounded-lg bg-white/95 dark:bg-card p-1 border border-border/80 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="SIMATS IoT"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight block text-foreground">
                      IoT CoE CMS
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      SSE • SIMATS
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-3">
                <AdminNav userRole={session.role} />
              </div>
            </div>

            {/* Sidebar Bottom Footer */}
            <div className="p-4 border-t border-border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <span className="text-xs font-semibold block truncate text-foreground">
                    {session.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono truncate block">
                    {session.email}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-mono transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Public Site</span>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </aside>

          {/* Main Admin Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {children}
            </div>
          </main>
        </>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  );
}
