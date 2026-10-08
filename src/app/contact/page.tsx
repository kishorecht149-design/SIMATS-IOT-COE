import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Location | IoT Lab CoE, Saveetha School of Engineering",
  description: "Official contact details and location for the Department of ECE IoT CoE.",
};

export default async function ContactPage() {
  const page = await getPage("contact");
  const settings = await getGlobalSettings();

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
