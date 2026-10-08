import { z } from "zod";

export const TeamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  rollNo: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  isLead: z.boolean().default(false),
});

export const MentorSchema = z.object({
  name: z.string().optional().default(""),
  designation: z.string().optional().default(""),
  email: z.string().email("Invalid email").or(z.literal("")).optional().default(""),
  phone: z.string().optional().default(""),
});

export const RequirementsSchema = z.object({
  powerOutlet: z.boolean().default(true),
  wifi: z.boolean().default(true),
  specialEquipment: z.string().max(300).optional().default(""),
});

export const RegistrationFormSchema = z.object({
  // Step 1: Team & College
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(100),
  collegeName: z.string().min(3, "College / Institution name is required").max(150),
  department: z.string().min(2, "Department is required").max(100),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  yearOfStudy: z.string().min(1, "Year of study is required"),

  // Step 2: Team Members
  leadMember: TeamMemberSchema.extend({
    isLead: z.literal(true),
  }),
  teamMembers: z
    .array(TeamMemberSchema)
    .min(1, "At least 1 additional team member is required (min team size: 2)")
    .max(3, "Maximum 3 additional team members allowed (max team size: 4)"),

  // Step 3: Project Details
  projectTitle: z.string().min(5, "Project title must be at least 5 characters").max(150),
  trackId: z.string().min(2, "Please select an exhibition track"),
  abstractText: z
    .string()
    .min(50, "Abstract must be at least 50 characters")
    .max(3000, "Abstract must be under 3000 characters"),
  hardwareComponents: z.array(z.string()).min(1, "List at least one hardware component/board used"),
  projectStage: z.string().min(2, "Please specify current development stage"),
  demoUrl: z.string().url("Invalid URL").or(z.literal("")).optional().default(""),

  // Step 4: Requirements
  requirements: RequirementsSchema.default({ powerOutlet: true, wifi: true, specialEquipment: "" }),

  // Step 5: Faculty Mentor
  mentorDetails: MentorSchema.optional(),

  // Step 6: Uploads
  abstractFileUrl: z.string().min(1, "Project abstract PDF is required"),
  posterFileUrl: z.string().optional().default(""),

  // Step 7: Consent & Anti-bot
  declarationAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the rules and declaration before submitting",
  }),
  honeypot: z.string().optional().default(""),
});

export type RegistrationFormData = z.infer<typeof RegistrationFormSchema>;
