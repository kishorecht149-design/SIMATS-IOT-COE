import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Showcase | Expothon 2026",
  description: "Exhibited and award-winning student IoT and embedded systems prototypes.",
};

export default function ShowcasePage() {
  const showcaseProjects: any[] = []; // Hidden / empty until post-event publication

  return (
    <div className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Project Archive
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Expothon Project Showcase
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Curated repository of working prototypes and evaluated projects presented at Expothon.
          </p>
        </div>

        {showcaseProjects.length === 0 ? (
          <div className="p-12 md:p-16 rounded-lg border-2 border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center text-center space-y-4 blueprint-grid">
            <div className="h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground shadow-sm">
              <Cpu className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground font-mono">
                [SHOWCASE ARCHIVE PENDING EXHIBITION]
              </h3>
              <p className="text-xs text-muted-foreground max-w-md font-mono">
                Following the jury assessment rounds on November 14–15, 2026, shortlisted and award-winning prototypes with schematics and abstracts will be curated here.
              </p>
            </div>
            <Badge variant="tech" size="sm">
              STATUS: PRE-EVENT PHASE
            </Badge>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Populated post-event */}
          </div>
        )}
      </div>
    </div>
  );
}
