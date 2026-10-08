import mongoose, { Schema, Document, Model } from "mongoose";

export type RegistrationStatus =
  | "Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Confirmed"
  | "Waitlisted"
  | "Rejected";

export interface ITeamMember {
  name: string;
  email: string;
  phone: string;
  rollNo?: string;
  gender?: string;
  isLead?: boolean;
}

export interface IInternalNote {
  note: string;
  addedBy: string;
  addedAt: Date;
}

export interface IRegistration extends Document {
  registrationId: string;
  teamName: string;
  collegeName: string;
  department: string;
  city: string;
  state: string;
  yearOfStudy: string;
  leadMember: ITeamMember;
  teamMembers: ITeamMember[];
  projectTitle: string;
  trackId: string;
  abstractText: string;
  hardwareComponents: string[];
  projectStage: string;
  demoUrl?: string;
  requirements: {
    powerOutlet: boolean;
    wifi: boolean;
    specialEquipment?: string;
  };
  mentorDetails?: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  abstractFileUrl: string;
  posterFileUrl?: string;
  status: RegistrationStatus;
  adminRemarks: string;
  internalNotes: IInternalNote[];
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    rollNo: { type: String, default: "" },
    gender: { type: String, default: "" },
    isLead: { type: Boolean, default: false },
  },
  { _id: false }
);

const InternalNoteSchema = new Schema<IInternalNote>(
  {
    note: { type: String, required: true },
    addedBy: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration>(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    teamName: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true, index: true },
    department: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    yearOfStudy: { type: String, required: true },
    leadMember: { type: TeamMemberSchema, required: true },
    teamMembers: [TeamMemberSchema],
    projectTitle: { type: String, required: true, trim: true },
    trackId: { type: String, required: true, trim: true, index: true },
    abstractText: { type: String, required: true },
    hardwareComponents: [{ type: String }],
    projectStage: { type: String, default: "Working Hardware Prototype" },
    demoUrl: { type: String, default: "" },
    requirements: {
      powerOutlet: { type: Boolean, default: true },
      wifi: { type: Boolean, default: true },
      specialEquipment: { type: String, default: "" },
    },
    mentorDetails: {
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    abstractFileUrl: { type: String, default: "" },
    posterFileUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Shortlisted", "Confirmed", "Waitlisted", "Rejected"],
      default: "Submitted",
      index: true,
    },
    adminRemarks: {
      type: String,
      default: "Your registration has been submitted and is currently queued for technical review.",
    },
    internalNotes: [InternalNoteSchema],
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index to help search & prevent duplicate active submission from same lead & project title
RegistrationSchema.index({ "leadMember.email": 1, projectTitle: 1 });
RegistrationSchema.index({ createdAt: -1 });

export const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
