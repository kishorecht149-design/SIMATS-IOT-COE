import React from "react";
import { getPage } from "@/lib/services/page-service";
import { getGlobalSettings } from "@/lib/services/settings-service";
import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import { getMemoryRegistrations } from "@/lib/services/registration-store";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [page, settings] = await Promise.all([
    getPage("home"),
    getGlobalSettings(),
  ]);

  let totalRegistrations = getMemoryRegistrations().length;
  try {
    const conn = await connectToDatabase();
    if (conn && isDatabaseConnected()) {
      totalRegistrations = await Registration.countDocuments();
    }
  } catch (err) {
    totalRegistrations = getMemoryRegistrations().length;
  }

  if (!page || !page.sections) {
    return <div className="p-12 text-center text-xs font-mono">Loading page...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          globalSettings={settings}
          liveCounts={{ totalRegistrations }}
        />
      ))}
    </div>
  );
}
