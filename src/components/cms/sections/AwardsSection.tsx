import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Award, Medal, Sparkles } from "lucide-react";

interface AwardsSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    prizes?: Array<{
      tier: string;
      badge: string;
      description: string;
    }>;
    certificateNote?: string;
  };
}

export function AwardsSection({ data }: AwardsSectionProps) {
  const prizes = data.prizes || [];

  return (
    <section id="awards" className="py-16 md:py-24 border-b border-border bg-card/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Excellence & Recognition
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Awards & Prizes"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((prize, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="tech" size="sm" className="bg-primary/10 text-primary border-primary/20">
                    {prize.badge}
                  </Badge>
                  {idx === 0 ? (
                    <Trophy className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Award className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {prize.tier}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                {prize.description}
              </p>
            </div>
          ))}
        </div>

        {data.certificateNote && (
          <div className="p-4 rounded border border-border bg-card flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <Medal className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>{data.certificateNote}</span>
          </div>
        )}
      </div>
    </section>
  );
}
