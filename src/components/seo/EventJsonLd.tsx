import React from "react";
import { GlobalSettingsType } from "@/lib/default-settings";

export function EventJsonLd({ settings }: { settings: GlobalSettingsType }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: `${settings.eventName} ${settings.eventEdition}`,
    description: settings.eventTagline,
    startDate: settings.eventStartDate,
    endDate: settings.eventEndDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: settings.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.venueAddress,
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        postalCode: "602105",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: `${settings.centreName}, ${settings.department}`,
      url: process.env.NEXT_PUBLIC_APP_URL || "https://iotcoe-expothon.saveetha.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
