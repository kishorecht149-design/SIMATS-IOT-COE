import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { CircuitBackground } from "@/components/ui/CircuitBackground";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatDateRange } from "@/lib/utils";

interface HeroSectionProps {
  data: {
    badge?: string;
    title: string;
    subtitle?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    showCircuitBg?: boolean;
    showStatusBadge?: boolean;
  };
  globalSettings?: any;
}

export function HeroSection({ data, globalSettings }: HeroSectionProps) {
  const isRegOpen = globalSettings?.registrationOpen ?? true;

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card/80 to-background pt-12 pb-20 md:pt-20 md:pb-28">
      {data.showCircuitBg !== false && <CircuitBackground />}

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-4xl space-y-6">
          {/* Top Micro-Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {data.badge && (
              <Badge variant="tech" size="sm" className="bg-primary/10 text-primary border-primary/20">
                {data.badge}
              </Badge>
            )}
            {data.showStatusBadge !== false && (
              <Badge variant={isRegOpen ? "success" : "warning"} size="sm">
                ● {isRegOpen ? "REGISTRATIONS ACTIVE" : "REGISTRATIONS CLOSED"}
              </Badge>
            )}
            <span className="text-[11px] font-mono text-muted-foreground">
              {globalSettings?.institutionShort || "SSE, SIMATS"}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-lg sm:text-xl font-medium text-foreground/80 max-w-3xl">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Body description */}
          {data.description && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {data.description}
            </p>
          )}

          {/* Institutional Highlights Bar */}
          {globalSettings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded border border-border bg-card/60 flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Exhibition Dates</span>
                  <span className="font-semibold text-foreground">
                    {formatDateRange(globalSettings.eventStartDate, globalSettings.eventEndDate)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded border border-border bg-card/60 flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Venue Location</span>
                  <span className="font-semibold text-foreground truncate block max-w-[200px]" title={globalSettings.venueName}>
                    {globalSettings.venueName}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded border border-border bg-card/60 flex items-start gap-2.5 sm:col-span-2 lg:col-span-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Eligibility</span>
                  <span className="font-semibold text-foreground">All Recognized Institutions</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            {data.primaryCtaLabel && data.primaryCtaHref && (
              <Link href={data.primaryCtaHref}>
                <Button size="lg" className="gap-2 font-semibold">
                  <span>{data.primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {data.secondaryCtaLabel && data.secondaryCtaHref && (
              <Link href={data.secondaryCtaHref}>
                <Button variant="outline" size="lg" className="font-medium">
                  {data.secondaryCtaLabel}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
