import React from "react";
import { Clock, MapPin, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  badge?: string;
  description?: string;
}

interface AgendaSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    dateLabel?: string;
    items?: AgendaItem[];
  };
}

export function AgendaSection({ data }: AgendaSectionProps) {
  const items = data.items || [];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-card/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 space-y-3">
          {data.badge && (
            <Badge variant="tech" size="sm">
              {data.badge}
            </Badge>
          )}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {data.title || "Day-of-Event Detailed Agenda"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle} {data.dateLabel && `• ${data.dateLabel}`}
            </p>
          )}
        </div>

        <div className="relative border-l-2 border-primary/40 ml-3 md:ml-32 space-y-8">
          {items.map((item, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8 group">
              {/* Bullet Node */}
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>

              {/* Time string displayed on left for md+ screens */}
              <div className="md:absolute md:-left-32 md:top-0 md:w-24 md:text-right font-mono text-xs font-bold text-primary">
                {item.time}
              </div>

              <div className="p-4 sm:p-5 rounded border border-border bg-background/80 hover:border-primary/40 transition-colors space-y-2 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-primary md:hidden">
                    {item.time}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <Badge variant="tech" size="sm" className="text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-muted-foreground">
                  {item.location && (
                    <span className="flex items-center gap-1 text-foreground/80">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {item.speaker && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>{item.speaker}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
