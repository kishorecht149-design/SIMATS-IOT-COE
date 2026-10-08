import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Cpu, Radio, Activity, Factory } from "lucide-react";

interface TracksGridSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    tracks?: Array<{
      id: string;
      code: string;
      title: string;
      description: string;
      topics: string;
    }>;
  };
}

export function TracksGridSection({ data }: TracksGridSectionProps) {
  const tracks = data.tracks || [];

  const icons = [Activity, Cpu, Radio, Factory];

  return (
    <section id="tracks" className="py-16 md:py-24 border-b border-border bg-card/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Technical Domains
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Exhibition Tracks"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={track.id || idx}
                className="p-6 sm:p-8 rounded border border-border bg-card shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/50 transition-colors group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="tech" size="sm" className="bg-primary/10 text-primary border-primary/20">
                      {track.code}
                    </Badge>
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Key Topics / Hardware
                    </span>
                    <p className="text-xs font-mono text-foreground/90 leading-normal">
                      {track.topics}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <Link
                    href={`/register?track=${encodeURIComponent(track.title)}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    <span>Submit Abstract for {track.code}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
