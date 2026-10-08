import React from "react";
import Image from "next/image";
import { ExternalLink, Award, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SponsorItem {
  name: string;
  tier: "Title Sponsor" | "Co-Sponsor" | "Technical Partner" | "Hardware Partner" | "Academic Partner";
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

interface SponsorsSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    sponsors?: SponsorItem[];
    partnerNote?: string;
  };
}

export function SponsorsSection({ data }: SponsorsSectionProps) {
  const sponsors = data.sponsors || [];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-card/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 space-y-3">
          {data.badge && (
            <Badge variant="tech" size="sm">
              {data.badge}
            </Badge>
          )}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {data.title || "Industry Sponsors & Technical Partners"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sp, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-background hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      sp.tier.includes("Title")
                        ? "default"
                        : sp.tier.includes("Technical") || sp.tier.includes("Hardware")
                        ? "tech"
                        : "outline"
                    }
                    size="sm"
                    className="text-[10px]"
                  >
                    {sp.tier}
                  </Badge>
                  {sp.websiteUrl && (
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                      aria-label={`${sp.name} Website`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="h-16 flex items-center justify-center rounded bg-muted/20 border border-border/40 p-2">
                  {sp.logoUrl ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={sp.logoUrl}
                        alt={sp.name}
                        fill
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-base text-foreground font-mono text-center">
                      {sp.name}
                    </span>
                  )}
                </div>

                {sp.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {sp.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border/40 text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Verified Partner</span>
              </div>
            </div>
          ))}
        </div>

        {data.partnerNote && (
          <div className="mt-8 p-4 rounded border border-border bg-muted/20 text-xs font-mono text-muted-foreground flex items-center gap-3">
            <Zap className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{data.partnerNote}</span>
          </div>
        )}
      </div>
    </section>
  );
}
