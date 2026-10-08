import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Exhibition Tracks & Thematic Domains | Expothon 2026 - SIMATS IoT CoE",
  description: "Explore the four specialized engineering tracks for Expothon 2026: Healthcare IoT, Smart Agriculture, Edge AI, and Industrial Automation.",
};

export default async function TracksPage() {
  const [page, settings] = await Promise.all([
    getPage("tracks"),
    getGlobalSettings(),
  ]);

  if (!page) {
    return <div className="p-12 text-center text-xs font-mono">Page not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          globalSettings={settings}
        />
      ))}
    </div>
  );
}
