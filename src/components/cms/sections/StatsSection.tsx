import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Users, Layers, Award } from "lucide-react";

interface StatsSectionProps {
  data: {
    title?: string;
    showLiveRegistrations?: boolean;
    stats?: Array<{
      label: string;
      value: string;
      helper?: string;
    }>;
  };
  liveCounts?: {
    totalRegistrations?: number;
  };
}

export function StatsSection({ data, liveCounts }: StatsSectionProps) {
  const statItems = [...(data.stats || [])];

  // If live registrations count is enabled and greater than 0, prepend it
  if (data.showLiveRegistrations && liveCounts?.totalRegistrations && liveCounts.totalRegistrations > 0) {
    statItems.unshift({
      label: "Registered Teams",
      value: `${liveCounts.totalRegistrations}`,
      helper: "Live Verified Submissions",
    });
  }

  if (statItems.length === 0) return null;

  return (
    <section className="py-12 border-b border-border bg-card/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded border border-border bg-card shadow-sm space-y-1.5"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
                {stat.label}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {stat.value}
              </div>
              {stat.helper && (
                <div className="text-[11px] text-muted-foreground font-mono truncate">
                  {stat.helper}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
