import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, Lock, ExternalLink } from "lucide-react";
import { GlobalSettingsType } from "@/lib/default-settings";
import { Badge } from "@/components/ui/Badge";

interface FooterProps {
  settings: GlobalSettingsType;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/60 text-card-foreground">
      {/* Top technical accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Institution & Centre Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-lg bg-white/95 dark:bg-card p-1 border border-border/80 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="SIMATS IoT Centre of Excellence"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight text-foreground">
                  {settings.centreName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {settings.department}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {settings.footer.aboutText}
            </p>

            <div className="pt-2 text-xs text-muted-foreground space-y-1.5 font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary mt-0.5" />
                <span>{settings.venueAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-primary transition-colors">
                  {settings.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Event Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {settings.footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Resources & Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {settings.footer.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Institution Badge & Admin Entry */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Host Institution
            </h4>
            <div className="p-3.5 rounded border border-border bg-background/50 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                {settings.institutionName}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {settings.footer.coordinatorNote}
              </p>
              <div className="pt-1">
                <Badge variant="tech" size="sm" className="text-[9px]">
                  IEEE / ISTE ALIGNED
                </Badge>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-muted-foreground font-mono transition-colors opacity-60 hover:opacity-100"
                title="Internal Portal"
              >
                <Lock className="h-2.5 w-2.5" />
                <span>Internal System</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span>© {currentYear} {settings.institutionShort}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>COE PORTAL ACTIVE</span>
            </span>
            <span>•</span>
            <span>EXPOTHON 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
