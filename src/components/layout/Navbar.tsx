"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlobalSettingsType } from "@/lib/default-settings";

interface NavbarProps {
  settings: GlobalSettingsType;
}

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = settings?.navigation || [];
  const isRegOpen = settings?.registrationOpen ?? true;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border shadow-sm py-2.5"
          : "bg-background border-border/80 py-3"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo with Official SIMATS IoT Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <div className="relative h-11 w-11 rounded-lg bg-white/95 dark:bg-card p-1 border border-border/80 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png"
              alt="SIMATS IoT Centre of Excellence"
              fill
              priority
              className="object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                IoT Lab CoE
              </span>
              <Badge variant="tech" size="sm" className="hidden sm:inline-flex text-[9px] py-0">
                ECE • SIMATS
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-xs">
              Saveetha School of Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded ${
                  isActive
                    ? "text-primary font-semibold bg-primary/5 dark:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono rounded border border-emerald-500/20 uppercase font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link href="/register" className="hidden sm:inline-flex">
            <Button size="sm" variant={isRegOpen ? "primary" : "secondary"}>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isRegOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"
                  }`}
                />
                {isRegOpen ? "Register Now" : "Status Portal"}
              </span>
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider px-3 py-1">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono rounded">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </div>
              </Link>
            );
          })}
          <div className="pt-3">
            <Link href="/register" className="block w-full">
              <Button className="w-full justify-center font-mono text-xs" size="sm">
                {isRegOpen ? "Expothon Registration" : "Check Registration Status"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
