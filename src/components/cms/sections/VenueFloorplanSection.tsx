import React from "react";
import Image from "next/image";
import { MapPin, Navigation, Cpu, Wifi, Zap, Wrench, Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VenueZone {
  zoneCode: string;
  name: string;
  description: string;
  facilities: string[];
}

interface VenueFloorplanSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    badge?: string;
    venueName?: string;
    venueAddress?: string;
    floorplanImageUrl?: string;
    zones?: VenueZone[];
    amenities?: string[];
  };
}

export function VenueFloorplanSection({ data }: VenueFloorplanSectionProps) {
  const zones = data.zones || [
    {
      zoneCode: "ZONE-A",
      name: "Healthcare & Biomedical Telemetry",
      description: "Dedicated demonstration benches for wearable bio-signal and patient telemetry hardware.",
      facilities: ["Isolated AC Supply", "Oscilloscopes", "Safety Mats"],
    },
    {
      zoneCode: "ZONE-B",
      name: "Edge AI & Embedded Computing",
      description: "High-bandwidth Wi-Fi zone for TinyML, edge vision, and real-time inference prototypes.",
      facilities: ["Dedicated 5GHz Wi-Fi", "5V/12V Regulated DC Benches"],
    },
    {
      zoneCode: "ZONE-C",
      name: "Smart Agriculture & Environmental",
      description: "Testbeds for LoRa gateways, soil telemetry nodes, and environmental sensor rigs.",
      facilities: ["LoRaWAN Gateway Node", "Water Testing Basin"],
    },
    {
      zoneCode: "ZONE-D",
      name: "Industrial IoT & Smart Infrastructure",
      description: "Heavy-duty test benches for Modbus, PLC telemetry, and power monitoring hardware.",
      facilities: ["3-Phase Power Monitoring", "RS485 Bus Analyzers"],
    },
  ];

  const amenities = data.amenities || [
    "60 Fully Equipped Lab Workstations",
    "Dual 230V AC Sockets per Team",
    "High-Speed Campus Wi-Fi (SSID: EXPOTHON-2026)",
    "Soldering & Hardware Rework Bench",
    "Digital Storage Oscilloscopes (DSO)",
    "Emergency First Aid & Safety Extinguishers",
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
            {data.title || "Exhibition Venue & Floor Plan"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Location Banner */}
        <div className="p-4 sm:p-6 rounded border border-border bg-card/60 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-foreground font-mono">
                {data.venueName || "IoT Lab Centre of Excellence, 3rd Floor, Department of ECE"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                {data.venueAddress || "Saveetha School of Engineering, SIMATS Deemed University, Chennai - 602105"}
              </p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Saveetha+School+of+Engineering"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono font-medium border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-fit"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Open Google Maps</span>
          </a>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {zones.map((zone, idx) => (
            <div
              key={idx}
              className="p-5 rounded border border-border bg-card hover:border-primary/40 transition-colors space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="tech" size="sm" className="text-[10px]">
                    {zone.zoneCode}
                  </Badge>
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-sm text-foreground">{zone.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {zone.description}
                </p>
              </div>

              {zone.facilities && zone.facilities.length > 0 && (
                <div className="pt-3 border-t border-border/40 space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block font-semibold">
                    Bench Amenities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {zone.facilities.map((fac, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/40 text-foreground/80 border border-border/60"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Amenities Bar */}
        <div className="p-6 rounded border border-border bg-card/40 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h4 className="font-bold text-sm text-foreground font-mono">
              Hardware & Power Logistics Provided to Shortlisted Teams
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
