import React from "react";
import { getPage } from "@/lib/services/page-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | IoT Lab CoE SSE SIMATS",
};

export default async function CodeOfConductPage() {
  const page = await getPage("code-of-conduct");
  if (!page) return <div className="p-12 text-center text-xs font-mono">Document not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
