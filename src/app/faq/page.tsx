import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Expothon 2026 - SIMATS IoT CoE",
  description: "Find clear answers to questions regarding team registration, prototype logistics, evaluation rubrics, travel, and accommodation.",
};

export default async function FaqPage() {
  const [page, settings] = await Promise.all([
    getPage("faq"),
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
