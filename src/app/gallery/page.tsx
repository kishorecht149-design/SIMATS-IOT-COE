import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Image as ImageIcon, Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo & Media Gallery | IoT Lab CoE SSE SIMATS",
};

export default function GalleryPage() {
  const albums: any[] = []; // Empty until uploaded by admin

  return (
    <div className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Media Archive
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            CoE Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Photographs of laboratory facilities, sensor testbeds, and technical exhibition proceedings.
          </p>
        </div>

        {albums.length === 0 ? (
          <div className="p-12 md:p-16 rounded-lg border-2 border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center text-center space-y-4 blueprint-grid">
            <div className="h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground shadow-sm">
              <Camera className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground font-mono">
                [GALLERY ARCHIVE EMPTY]
              </h3>
              <p className="text-xs text-muted-foreground max-w-md font-mono">
                Official high-resolution exhibition photos and lab albums will be published here following the event sessions.
              </p>
            </div>
            <Badge variant="tech" size="sm">
              STATUS: PENDING EXHIBITION SESSION
            </Badge>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Populated when admin uploads images */}
          </div>
        )}
      </div>
    </div>
  );
}
