import React from "react";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";

interface CardGridSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    columns?: number;
    cards?: Array<{
      badge?: string;
      title: string;
      description: string;
    }>;
  };
}

export function CardGridSection({ data }: CardGridSectionProps) {
  const cards = data.cards || [];
  const cols = data.columns || 3;

  const colClass =
    cols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <section id="rules" className="py-16 md:py-24 border-b border-border bg-card/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Guidelines & Structure
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Information"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${colClass} gap-6`}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card shadow-sm space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {card.badge && (
                  <Badge variant="tech" size="sm">
                    {card.badge}
                  </Badge>
                )}
                <h3 className="text-base font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
