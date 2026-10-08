import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, MapPin, Users, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface WorkshopItem {
  id?: string;
  title: string;
  track?: string;
  instructor: string;
  instructorDesignation?: string;
  date: string;
  time: string;
  location: string;
  seats: string;
  description: string;
  prerequisites?: string;
  badge?: string;
}

interface WorkshopsSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    workshops?: WorkshopItem[];
    ctaLabel?: string;
    ctaHref?: string;
  };
}

export function WorkshopsSection({ data }: WorkshopsSectionProps) {
  const workshops: WorkshopItem[] = data.workshops || [
    {
      title: "Hands-on ESP32 & FreeRTOS Real-Time Firmware",
      track: "Track 01 & 04",
      instructor: "Dr. Technical Coordinator",
      instructorDesignation: "IoT Lab CoE, Saveetha School of Engineering",
      date: "November 03, 2026",
      time: "10:00 AM - 1:00 PM",
      location: "IoT Systems Laboratory (Room 304)",
      seats: "40 Seats (Pre-registration required)",
      description: "Learn multi-threaded sensor acquisition, non-blocking MQTT telemetry, and low-power deep sleep cycles using ESP-IDF.",
      prerequisites: "Basic C/C++ knowledge",
      badge: "HANDS-ON LAB",
    },
    {
      title: "TinyML: Deploying Neural Networks on Microcontrollers",
      track: "Track 02",
      instructor: "Industry Expert & Edge AI Specialist",
      instructorDesignation: "Embedded Systems Partner",
      date: "November 03, 2026",
      time: "2:00 PM - 5:00 PM",
      location: "Advanced Computing Lab (Room 308)",
      seats: "40 Seats (Pre-registration required)",
      description: "TensorFlow Lite for Microcontrollers, model quantization, vibration anomaly detection, and vision inference on ESP32-S3.",
      prerequisites: "Python and microcontroller basics",
      badge: "ADVANCED WORKSHOP",
    },
    {
      title: "LoRaWAN & Long-Range Telemetry for Smart Agriculture",
      track: "Track 03",
      instructor: "RF Systems Faculty Specialist",
      instructorDesignation: "Department of ECE, SSE SIMATS",
      date: "November 04, 2026",
      time: "11:30 AM - 1:00 PM",
      location: "RF & Wireless Systems Lab",
      seats: "35 Seats",
      description: "SX1276 transceiver configuration, ChirpStack/The Things Network gateway setup, and long-range environmental telemetry.",
      prerequisites: "Basic sensor interfacing",
      badge: "FIELD TELEMETRY",
    },
  ];

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
            {data.title || "Technical Workshops & Hands-on Training"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((ws, idx) => (
            <div
              key={idx}
              className="p-6 rounded border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="tech" size="sm" className="text-[10px]">
                    {ws.badge || "WORKSHOP"}
                  </Badge>
                  {ws.track && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {ws.track}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">
                  {ws.title}
                </h3>

                <div className="space-y-1 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{ws.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{ws.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{ws.location}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {ws.description}
                </p>

                {ws.prerequisites && (
                  <div className="p-2.5 rounded bg-muted/20 border border-border text-[11px] font-mono text-muted-foreground">
                    <span className="font-semibold text-foreground">Prerequisites: </span>
                    {ws.prerequisites}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>{ws.seats}</span>
                </div>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="h-7 text-xs font-mono">
                    Join Session
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
