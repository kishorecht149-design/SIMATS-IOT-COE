import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, MapPin, Trophy, ArrowRight, ShieldCheck, Zap, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EventAnnouncementSectionProps {
  data: {
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    eventDate?: string;
    venue?: string;
    prizePool?: string;
    eligibility?: string;
    highlights?: string[];
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    coordinatorInfo?: string;
    urgentBannerText?: string;
  };
}

export function EventAnnouncementSection({ data }: EventAnnouncementSectionProps) {
  const highlights = data.highlights || [
    "36-Hour Non-stop Hardware Prototyping Hackathon",
    "Pre-configured ESP32-S3 & LoRa hardware development kits provided",
    "Live mentorship from semiconductor firmware architects",
    "Cash prizes and direct incubation pathway for top 3 teams",
  ];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-radial-gradient relative overflow-hidden">
      {/* Decorative Grid Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
        {data.urgentBannerText && (
          <div className="mb-6 p-3 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-mono flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 flex-shrink-0 animate-pulse" />
              <span className="font-bold">{data.urgentBannerText}</span>
            </div>
            {data.primaryCtaHref && (
              <Link href={data.primaryCtaHref} className="hover:underline flex items-center gap-1 font-bold">
                <span>Apply Now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        <div className="p-8 sm:p-12 rounded-xl border-2 border-primary/40 bg-card/90 shadow-xl relative overflow-hidden backdrop-blur-sm">
          {/* Top Badge & Corner Glow */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Badge variant="tech" size="sm" className="bg-primary text-primary-foreground font-bold font-mono px-3 py-1 text-xs shadow-xs">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {data.badge || "NEW EVENT ANNOUNCEMENT"}
              </Badge>
              {data.prizePool && (
                <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{data.prizePool}</span>
                </span>
              )}
            </div>

            <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Department of ECE • IoT Lab CoE</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl space-y-4 mb-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              {data.title || "National TinyML & Edge AI Hackathon 2026"}
            </h2>
            {data.subtitle && (
              <p className="text-base sm:text-lg text-primary font-mono font-medium">
                {data.subtitle}
              </p>
            )}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {data.description ||
                "An intensive national innovation sprint challenging student engineers to deploy quantized neural networks and low-power sensor telemetry nodes on edge microcontrollers. Open to all recognized colleges across India."}
            </p>
          </div>

          {/* Event Key Details Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 rounded-lg bg-background/80 border border-border">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase font-semibold">Date & Timeline</span>
                <span className="font-bold text-sm text-foreground font-mono">
                  {data.eventDate || "December 12 - 13, 2026"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase font-semibold">Venue / Platform</span>
                <span className="font-bold text-sm text-foreground font-mono">
                  {data.venue || "IoT Lab CoE, Saveetha School of Engineering"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase font-semibold">Eligibility</span>
                <span className="font-bold text-sm text-foreground font-mono">
                  {data.eligibility || "UG / PG Engineering Students (Teams of 2-4)"}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="mb-8 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Event Highlights & Benefits:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono text-foreground/90">
              {highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded bg-card/60 border border-border/60">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons & Contact Desk */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link href={data.primaryCtaHref || "/register"} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto font-mono text-xs gap-2">
                  <span>{data.primaryCtaLabel || "Register for Event"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {data.secondaryCtaLabel && (
                <Link href={data.secondaryCtaHref || "/downloads"} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-mono text-xs gap-2">
                    <span>{data.secondaryCtaLabel}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {data.coordinatorInfo && (
              <div className="text-[11px] font-mono text-muted-foreground text-center sm:text-right">
                <span>{data.coordinatorInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
