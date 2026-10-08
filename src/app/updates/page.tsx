import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Megaphone, Calendar, ArrowRight, Pin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements & Updates | Expothon 2026",
  description: "Official notifications and updates regarding Expothon 2026 from the IoT Lab CoE.",
};

export default function UpdatesPage() {
  const updates = [
    {
      id: "up-1",
      pinned: true,
      category: "REGISTRATION",
      title: "Expothon 2026 Online Abstract Submission Portal Is Live",
      date: "2026-10-08T00:00:00.000Z",
      summary: "Undergraduate engineering, polytechnic, and diploma student teams are invited to register and upload project abstracts across the 4 thematic tracks. Deadline: October 31, 2026.",
    },
    {
      id: "up-2",
      pinned: false,
      category: "GUIDELINES",
      title: "Hardware Benchmark and Power Specifications Announced",
      date: "2026-10-05T00:00:00.000Z",
      summary: "Shortlisted teams will receive dedicated bench space, 230V AC supply, and high-speed Wi-Fi access. Review full hardware safety compliance rules on the guidelines page.",
    },
  ];

  return (
    <div className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Official Bulletins
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Announcements & Updates
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Official notices released by the IoT Lab CoE Organizing Committee.
          </p>
        </div>

        <div className="space-y-4">
          {updates.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded border border-border bg-card shadow-sm space-y-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Badge variant="tech" size="sm">
                    {post.category}
                  </Badge>
                  {post.pinned && (
                    <Badge variant="default" size="sm" className="gap-1">
                      <Pin className="h-3 w-3" />
                      <span>PINNED</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {post.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
