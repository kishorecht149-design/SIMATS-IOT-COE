import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  institutionName: string;
  institutionShort: string;
  department: string;
  centreName: string;
  centreShort: string;
  eventName: string;
  eventEdition: string;
  eventTagline: string;
  eventStartDate: Date;
  eventEndDate: Date;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  contactEmail: string;
  contactPhone: string;
  registrationOpen: boolean;
  registrationDeadline: Date;
  maxCapacity: number;
  minTeamSize: number;
  maxTeamSize: number;
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
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    institutionName: { type: String, required: true },
    institutionShort: { type: String, required: true },
    department: { type: String, required: true },
    centreName: { type: String, required: true },
    centreShort: { type: String, required: true },
    eventName: { type: String, required: true },
    eventEdition: { type: String, required: true },
    eventTagline: { type: String, required: true },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    venueName: { type: String, required: true },
    venueAddress: { type: String, required: true },
    venueMapUrl: { type: String, default: "" },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    registrationOpen: { type: Boolean, default: true },
    registrationDeadline: { type: Date, required: true },
    maxCapacity: { type: Number, default: 100 },
    minTeamSize: { type: Number, default: 2 },
    maxTeamSize: { type: Number, default: 4 },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: "" },
      linkUrl: { type: String, default: "" },
      linkText: { type: String, default: "" },
    },
    navigation: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
        badge: { type: String, default: "" },
      },
    ],
    footer: {
      aboutText: { type: String, default: "" },
      quickLinks: [{ label: String, href: String }],
      resources: [{ label: String, href: String }],
      coordinatorNote: { type: String, default: "" },
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
