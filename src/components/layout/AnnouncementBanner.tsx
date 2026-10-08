"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";

interface AnnouncementBannerProps {
  announcement?: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    linkText?: string;
  };
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  if (!announcement || !announcement.enabled || !announcement.text) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-xs md:text-sm font-medium border-b border-primary-hover/50">
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <Megaphone className="h-3.5 w-3.5 flex-shrink-0 text-cyan-300 animate-pulse" />
          <span className="truncate">{announcement.text}</span>
        </div>
        {announcement.linkUrl && announcement.linkText && (
          <Link
            href={announcement.linkUrl}
            className="flex-shrink-0 inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:text-cyan-200 transition-colors"
          >
            {announcement.linkText}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
