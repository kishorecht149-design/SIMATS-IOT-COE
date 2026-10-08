import React from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DownloadsSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    files?: Array<{
      title: string;
      size: string;
      href: string;
    }>;
  };
}

export function DownloadsSection({ data }: DownloadsSectionProps) {
  const files = data.files || [];

  return (
    <section id="downloads" className="py-16 md:py-24 border-b border-border bg-card/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Official Resources
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Downloads & Documentation"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="p-5 rounded border border-border bg-card shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {file.title}
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    {file.size}
                  </span>
                </div>
              </div>

              <a
                href={file.href || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 p-2 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
