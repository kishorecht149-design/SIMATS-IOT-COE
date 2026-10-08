import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Jury Assessment & Evaluation Rubrics | Expothon 2026",
  description: "Scoring rubrics and technical criteria used by the expert jury panel to evaluate hardware and embedded prototypes.",
};

export default async function EvaluationPage() {
  const [page, settings] = await Promise.all([
    getPage("evaluation"),
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
