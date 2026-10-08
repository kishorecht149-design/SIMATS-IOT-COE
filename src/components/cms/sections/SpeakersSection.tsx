import React from "react";
import Image from "next/image";
import { User, Award, ExternalLink, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SpeakerItem {
  name: string;
  designation: string;
  organization: string;
  topic?: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  badge?: string;
}

interface SpeakersSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    speakers?: SpeakerItem[];
  };
}

export function SpeakersSection({ data }: SpeakersSectionProps) {
  const speakers = data.speakers || [];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-12 space-y-3">
          {data.badge && (
            <Badge variant="tech" size="sm">
              {data.badge}
            </Badge>
          )}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {data.title || "Keynote Speakers & Jury Panel"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((spk, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card hover:border-primary/50 transition-all space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-mono font-bold text-sm">
                    {spk.image ? (
                      <div className="relative h-full w-full rounded-full overflow-hidden">
                        <Image src={spk.image} alt={spk.name} fill className="object-cover" />
                      </div>
                    ) : (
                      spk.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{spk.name}</h3>
                    <p className="text-xs text-primary font-mono font-medium">{spk.designation}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{spk.organization}</p>
                  </div>
                </div>

                {spk.topic && (
                  <div className="p-2.5 rounded bg-muted/30 border border-border/80 text-xs font-mono space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Keynote Session:</span>
                    <span className="text-foreground font-medium">&quot;{spk.topic}&quot;</span>
                  </div>
                )}

                {spk.bio && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {spk.bio}
                  </p>
                )}
              </div>

              {spk.linkedin && (
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  {spk.badge && (
                    <Badge variant="outline" size="sm" className="text-[10px]">
                      {spk.badge}
                    </Badge>
                  )}
                  <a
                    href={spk.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ml-auto"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>Profile</span>
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
