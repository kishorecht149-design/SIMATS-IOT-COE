import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

interface TimelineSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    events?: Array<{
      phase: string;
      title: string;
      date: string;
      status: "completed" | "active" | "upcoming";
      description: string;
    }>;
  };
}

export function TimelineSection({ data }: TimelineSectionProps) {
  const events = data.events || [];

  return (
    <section id="schedule" className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Critical Dates
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Key Dates & Milestones"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="relative border-l-2 border-border/80 ml-4 md:ml-6 pl-6 md:pl-10 space-y-10">
          {events.map((event, idx) => {
            const isActive = event.status === "active";
            const isCompleted = event.status === "completed";

            return (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div
                  className={`absolute -left-[31px] md:-left-[47px] top-1.5 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center transition-all ${
                    isActive
                      ? "border-primary text-primary shadow-[0_0_12px_rgba(2,132,199,0.5)] scale-110"
                      : isCompleted
                      ? "border-emerald-500 text-emerald-500"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>

                {/* Event Card */}
                <div className="p-5 sm:p-6 rounded border border-border bg-card shadow-sm space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="tech" size="sm">
                        STAGE {event.phase}
                      </Badge>
                      <Badge
                        variant={isActive ? "success" : isCompleted ? "secondary" : "outline"}
                        size="sm"
                      >
                        {isActive ? "● CURRENT STAGE" : isCompleted ? "COMPLETED" : "UPCOMING"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-primary">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
