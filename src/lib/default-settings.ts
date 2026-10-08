export interface GlobalSettingsType {
  institutionName: string;
  institutionShort: string;
  department: string;
  centreName: string;
  centreShort: string;
  eventName: string;
  eventEdition: string;
  eventTagline: string;
  eventStartDate: string;
  eventEndDate: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  contactEmail: string;
  contactPhone: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  maxCapacity: number;
  minTeamSize: number;
  maxTeamSize: number;
  registrationFormConfig?: {
    allowAbstractUpload: boolean;
    requireAbstractUpload: boolean;
    allowPosterUpload: boolean;
    allowDemoUrl: boolean;
    requireMentorDetails: boolean;
    allowHardwareChecklist: boolean;
    registrationFeeNote?: string;
    customInstructions?: string;
    customFields?: Array<{
      id: string;
      label: string;
      type: "text" | "select" | "textarea" | "checkbox";
      required: boolean;
      options?: string;
      placeholder?: string;
    }>;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    linkText?: string;
  };
  navigation: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
    badge?: string;
  }>;
  footer: {
    aboutText: string;
    quickLinks: Array<{ label: string; href: string }>;
    resources: Array<{ label: string; href: string }>;
    coordinatorNote: string;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
}

export const DEFAULT_SETTINGS: GlobalSettingsType = {
  institutionName: "Saveetha School of Engineering, SIMATS",
  institutionShort: "SSE, SIMATS",
  department: "Department of Electronics & Communication Engineering",
  centreName: "IoT Lab Centre of Excellence (CoE)",
  centreShort: "IoT CoE",
  eventName: "Expothon",
  eventEdition: "2026",
  eventTagline: "National-Level IoT & Embedded Systems Project Exhibition",
  eventStartDate: "2026-11-04T09:00:00.000Z",
  eventEndDate: "2026-11-04T17:00:00.000Z",
  venueName: "IoT Centre of Excellence Lab, Department of ECE",
  venueAddress: "Saveetha School of Engineering, SIMATS Deemed University, Chennai, Tamil Nadu - 602105",
  venueMapUrl: "https://maps.google.com/?q=Saveetha+School+of+Engineering+Chennai",
  contactEmail: "iotcoe.ece@saveetha.com",
  contactPhone: "+91 44 2680 1999",
  registrationOpen: true,
  registrationDeadline: "2026-10-28T23:59:59.000Z",
  maxCapacity: 100,
  minTeamSize: 2,
  maxTeamSize: 4,
  registrationFormConfig: {
    allowAbstractUpload: true,
    requireAbstractUpload: true,
    allowPosterUpload: true,
    allowDemoUrl: true,
    requireMentorDetails: false,
    allowHardwareChecklist: true,
    registrationFeeNote: "Participation is free for all shortlisted teams. Institutional ID verification mandatory.",
    customInstructions: "Ensure your project abstract adheres strictly to the 1-page IEEE layout format. Hardware prototypes are mandatory for on-campus demonstration.",
    customFields: [
      {
        id: "cf-food-preference",
        label: "Dietary / Lunch Preference (On-Campus)",
        type: "select",
        required: false,
        options: "Vegetarian, Non-Vegetarian",
        placeholder: "Select meal preference",
      },
    ],
  },
  announcement: {
    enabled: true,
    text: "Registrations for Expothon 2026 are officially open. Internal and external college teams are invited to submit abstracts.",
    linkUrl: "/register",
    linkText: "Register Team",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "About CoE", href: "/about" },
    { label: "Tracks", href: "/tracks" },
    { label: "Rules", href: "/rules" },
    { label: "Schedule", href: "/schedule" },
    { label: "Awards", href: "/awards" },
    { label: "Register", href: "/register", badge: "OPEN" },
    { label: "Check Status", href: "/registration-status" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    aboutText: "The IoT Lab Centre of Excellence at Saveetha School of Engineering (SIMATS) focuses on embedded systems, IoT prototyping, edge sensor networks, and industry-aligned collaborative research.",
    quickLinks: [
      { label: "About the CoE", href: "/about" },
      { label: "Lab Facilities", href: "/facilities" },
      { label: "Exhibition Tracks", href: "/tracks" },
      { label: "Rules & Eligibility", href: "/rules" },
      { label: "Schedule & Milestones", href: "/schedule" },
      { label: "Awards & Prizes", href: "/awards" },
      { label: "Evaluation Criteria", href: "/evaluation" },
    ],
    resources: [
      { label: "Organizing Committee", href: "/team" },
      { label: "Download Brochure", href: "/downloads" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Announcements & Updates", href: "/updates" },
      { label: "Code of Conduct", href: "/code-of-conduct" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    coordinatorNote: "Organized by Department of Electronics & Communication Engineering (ECE), Saveetha School of Engineering.",
  },
  socialLinks: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://x.com",
  },
};
