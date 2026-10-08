import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Mail, User } from "lucide-react";

interface TeamSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    members?: Array<{
      name: string;
      designation: string;
      department?: string;
      email?: string;
    }>;
  };
}

export function TeamSection({ data }: TeamSectionProps) {
  const members = data.members || [];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              CoE Leadership
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Organizing Committee"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                  <User className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-primary">
                    {member.designation}
                  </p>
                  {member.department && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {member.department}
                    </p>
                  )}
                </div>
              </div>

              {member.email && (
                <div className="pt-3 border-t border-border/60">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{member.email}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
