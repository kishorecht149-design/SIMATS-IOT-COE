import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Image as ImageIcon, Cpu } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface TextImageSectionProps {
  data: {
    badge?: string;
    title: string;
    body: string;
    imageSlot?: string;
    imageAlt?: string;
    imagePosition?: "left" | "right";
    ctaLabel?: string;
    ctaHref?: string;
  };
}

export function TextImageSection({ data }: TextImageSectionProps) {
  const isImageLeft = data.imagePosition === "left";
  const sanitizedHtml = DOMPurify.sanitize(data.body || "");

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center`}>
          {/* Text Content */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              isImageLeft ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="space-y-2">
              {data.badge && (
                <Badge variant="tech" size="sm" className="bg-primary/10 text-primary border-primary/20">
                  {data.badge}
                </Badge>
              )}
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                {data.title}
              </h2>
            </div>

            <div
              className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />

            {data.ctaLabel && data.ctaHref && (
              <div className="pt-2">
                <Link href={data.ctaHref}>
                  <Button variant="outline" className="gap-2 font-mono text-xs">
                    <span>{data.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Image Slot / Neat Technical Blueprint Frame */}
          <div
            className={`lg:col-span-5 ${
              isImageLeft ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {data.imageSlot ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border shadow-md">
                <Image
                  src={data.imageSlot}
                  alt={data.imageAlt || data.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-lg border-2 border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center p-6 text-center space-y-3 blueprint-grid">
                <div className="h-12 w-12 rounded bg-background/80 border border-border flex items-center justify-center text-muted-foreground shadow-sm">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-foreground block">
                    [LAB INFRASTRUCTURE PHOTO SLOT]
                  </span>
                  <p className="text-[11px] text-muted-foreground max-w-xs font-mono">
                    Department of Electronics & Communication Engineering
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
