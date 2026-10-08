import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { TextImageSection } from "./sections/TextImageSection";
import { TracksGridSection } from "./sections/TracksGridSection";
import { TimelineSection } from "./sections/TimelineSection";
import { CardGridSection } from "./sections/CardGridSection";
import { JudgingCriteriaSection } from "./sections/JudgingCriteriaSection";
import { AwardsSection } from "./sections/AwardsSection";
import { FaqSection } from "./sections/FaqSection";
import { DownloadsSection } from "./sections/DownloadsSection";
import { TeamSection } from "./sections/TeamSection";
import { ContactSection } from "./sections/ContactSection";
import { RichTextSection } from "./sections/RichTextSection";
import { AgendaSection } from "./sections/AgendaSection";
import { SpeakersSection } from "./sections/SpeakersSection";
import { SponsorsSection } from "./sections/SponsorsSection";
import { VenueFloorplanSection } from "./sections/VenueFloorplanSection";
import { RegistrationStagesSection } from "./sections/RegistrationStagesSection";
import { WorkshopsSection } from "./sections/WorkshopsSection";
import { EventAnnouncementSection } from "./sections/EventAnnouncementSection";

interface SectionRendererProps {
  section: {
    id: string;
    type: string;
    enabled: boolean;
    data: Record<string, any>;
  };
  globalSettings?: any;
  liveCounts?: any;
}

export function SectionRenderer({
  section,
  globalSettings,
  liveCounts,
}: SectionRendererProps) {
  if (!section.enabled) return null;

  switch (section.type) {
    case "hero":
      return <HeroSection data={section.data as any} globalSettings={globalSettings} />;
    case "stats_strip":
      return <StatsSection data={section.data as any} liveCounts={liveCounts} />;
    case "text_image":
      return <TextImageSection data={section.data as any} />;
    case "tracks_grid":
      return <TracksGridSection data={section.data as any} />;
    case "timeline":
      return <TimelineSection data={section.data as any} />;
    case "card_grid":
      return <CardGridSection data={section.data as any} />;
    case "judging_criteria":
      return <JudgingCriteriaSection data={section.data as any} />;
    case "awards_prizes":
      return <AwardsSection data={section.data as any} />;
    case "faq_accordion":
      return <FaqSection data={section.data as any} />;
    case "downloads":
      return <DownloadsSection data={section.data as any} />;
    case "team_grid":
      return <TeamSection data={section.data as any} />;
    case "contact_strip":
      return <ContactSection data={section.data as any} />;
    case "rich_text":
      return <RichTextSection data={section.data as any} />;
    case "schedule_agenda":
      return <AgendaSection data={section.data as any} />;
    case "speakers_grid":
      return <SpeakersSection data={section.data as any} />;
    case "sponsors_grid":
      return <SponsorsSection data={section.data as any} />;
    case "venue_floorplan":
      return <VenueFloorplanSection data={section.data as any} />;
    case "registration_stages":
      return <RegistrationStagesSection data={section.data as any} />;
    case "workshops_list":
      return <WorkshopsSection data={section.data as any} />;
    case "event_announcement":
      return <EventAnnouncementSection data={section.data as any} />;
    default:
      return null;
  }
}
