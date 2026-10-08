import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, FileCheck, ShieldAlert, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface StageItem {
  stageNumber: string;
  title: string;
  dateRange: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  actionText?: string;
  actionHref?: string;
}

interface RegistrationStagesSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    stages?: StageItem[];
    note?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
  };
}

export function RegistrationStagesSection({ data }: RegistrationStagesSectionProps) {
  const stages: StageItem[] = data.stages || [
    {
      stageNumber: "01",
      title: "Online Registration & Team Details",
      dateRange: "Oct 10 - Oct 28, 2026",
      status: "active",
      description: "Team Leader registers online with member names, register numbers, department, and contact info.",
      actionText: "Register Online",
      actionHref: "/register",
    },
    {
      stageNumber: "02",
      title: "Abstract PDF & Architecture Upload",
      dateRange: "By Oct 28, 2026 (5:00 PM)",
      status: "active",
      description: "Submit 1-page IEEE format project abstract with block diagram, microcontroller selection, and problem statement.",
      actionText: "Submission Guidelines",
      actionHref: "/guidelines",
    },
    {
      stageNumber: "03",
      title: "Technical Review & Shortlist Notice",
      dateRange: "Nov 01, 2026",
      status: "upcoming",
      description: "Faculty review committee screens submissions for originality, hardware feasibility, and track alignment.",
    },
    {
      stageNumber: "04",
      title: "On-Campus Live Demonstration",
      dateRange: "Nov 04, 2026 (9:00 AM - 4:00 PM)",
      status: "upcoming",
      description: "Shortlisted teams assemble at IoT Lab CoE benches for physical prototype demonstration and jury Q&A.",
    },
    {
      stageNumber: "05",
      title: "Jury Scoring & Valedictory Ceremony",
      dateRange: "Nov 04, 2026 (4:00 PM onwards)",
      status: "upcoming",
      description: "Announcement of track winners, cash awards, and distribution of IEEE participation certificates.",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-card/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 space-y-3">
          {data.badge && (
            <Badge variant="tech" size="sm">
              {data.badge}
            </Badge>
          )}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {data.title || "Registration & Evaluation Pipeline"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {stages.map((stg, idx) => {
            const isActive = stg.status === "active";
            const isCompleted = stg.status === "completed";

            return (
              <div
                key={idx}
                className={`p-5 rounded border flex flex-col justify-between space-y-4 transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                    : "border-border bg-background/80 hover:border-primary/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      STAGE {stg.stageNumber}
                    </span>
                    {isActive ? (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                      </span>
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{stg.title}</h3>
                  <div className="text-[11px] font-mono text-primary font-medium">
                    {stg.dateRange}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stg.description}
                  </p>
                </div>

                {stg.actionText && stg.actionHref && (
                  <div className="pt-3 border-t border-border/60">
                    <Link
                      href={stg.actionHref}
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>{stg.actionText}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded border border-border bg-card/60">
          <div className="text-xs font-mono text-muted-foreground">
            {data.note || "Notice: Hardware verification on November 04, 2026 is mandatory for all registered teams."}
          </div>
          <Link href={data.primaryCtaHref || "/register"}>
            <Button variant="primary" size="sm" className="font-mono">
              {data.primaryCtaLabel || "Start Registration"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
