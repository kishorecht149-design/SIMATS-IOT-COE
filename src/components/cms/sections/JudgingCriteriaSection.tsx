import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Scale } from "lucide-react";

interface JudgingCriteriaSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    criteria?: Array<{
      title: string;
      weight: string;
      description: string;
    }>;
  };
}

export function JudgingCriteriaSection({ data }: JudgingCriteriaSectionProps) {
  const criteria = data.criteria || [];

  return (
    <section id="evaluation" className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Jury Assessment Rubrics
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Evaluation Criteria"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-primary font-mono">
                    {item.weight}
                  </span>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
