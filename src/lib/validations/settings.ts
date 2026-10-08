import { z } from "zod";

export const SettingsUpdateSchema = z.object({
  institutionName: z.string().min(2),
  institutionShort: z.string().min(2),
  department: z.string().min(2),
  centreName: z.string().min(2),
  centreShort: z.string().min(2),
  eventName: z.string().min(2),
  eventEdition: z.string().min(1),
  eventTagline: z.string().min(5),
  eventStartDate: z.string(),
  eventEndDate: z.string(),
  venueName: z.string().min(2),
  venueAddress: z.string().min(5),
  venueMapUrl: z.string().optional().default(""),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  registrationOpen: z.boolean(),
  registrationDeadline: z.string(),
  maxCapacity: z.number().int().min(1),
  minTeamSize: z.number().int().min(1).max(5),
  maxTeamSize: z.number().int().min(1).max(10),
  registrationFormConfig: z
    .object({
      allowAbstractUpload: z.boolean().default(true),
      requireAbstractUpload: z.boolean().default(true),
      allowPosterUpload: z.boolean().default(true),
      allowDemoUrl: z.boolean().default(true),
      requireMentorDetails: z.boolean().default(false),
      allowHardwareChecklist: z.boolean().default(true),
      registrationFeeNote: z.string().optional().default(""),
      customInstructions: z.string().optional().default(""),
      customFields: z
        .array(
          z.object({
            id: z.string(),
            label: z.string(),
            type: z.enum(["text", "select", "textarea", "checkbox"]),
            required: z.boolean().default(false),
            options: z.string().optional().default(""),
            placeholder: z.string().optional().default(""),
          })
        )
        .optional()
        .default([]),
    })
    .optional(),
  emailTemplates: z
    .object({
      confirmationSubject: z.string().optional().default(""),
      confirmationHeading: z.string().optional().default(""),
      confirmationSubheading: z.string().optional().default(""),
      confirmationGreeting: z.string().optional().default(""),
      confirmationBodyText: z.string().optional().default(""),
      confirmationNextSteps: z.string().optional().default(""),
      confirmationFooterNote: z.string().optional().default(""),
      statusUpdateSubject: z.string().optional().default(""),
      statusUpdateBody: z.string().optional().default(""),
    })
    .optional(),
  announcement: z.object({
    enabled: z.boolean(),
    text: z.string(),
    linkUrl: z.string().optional().default(""),
    linkText: z.string().optional().default(""),
  }),
  navigation: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
      isExternal: z.boolean().optional().default(false),
      badge: z.string().optional().default(""),
    })
  ),
  footer: z.object({
    aboutText: z.string(),
    quickLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    resources: z.array(z.object({ label: z.string(), href: z.string() })),
    coordinatorNote: z.string(),
  }),
  socialLinks: z.object({
    linkedin: z.string().optional().default(""),
    github: z.string().optional().default(""),
    twitter: z.string().optional().default(""),
    youtube: z.string().optional().default(""),
  }),
});
