import React from "react";
import { getPage } from "@/lib/services/page-service";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Expothon 2026",
};

export default async function TermsPage() {
  const page = await getPage("terms");
  if (!page) return <div className="p-12 text-center text-xs font-mono">Terms not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
