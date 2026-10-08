import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Expothon 2026 Guidelines, Tracks & Rules | Saveetha IoT CoE",
  description: "Official rules, evaluation rubrics, timeline, and tracks for Expothon 2026 National-Level Project Exhibition.",
};

export default async function ExpothonPage() {
  const [page, settings] = await Promise.all([
    getPage("expothon"),
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
