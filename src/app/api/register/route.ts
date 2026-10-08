import { NextRequest, NextResponse } from "next/server";
import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { RegistrationFormSchema } from "@/lib/validations/registration";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/services/audit-service";
import { sendRegistrationConfirmationEmail } from "@/lib/services/email-service";
import { formatDateRange } from "@/lib/utils";
import { addMemoryRegistration, getMemoryRegistrations } from "@/lib/services/registration-store";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Rate Limiting: 10 registration submissions per 10 minutes per IP
    const rateLimit = await checkRateLimit(`reg_${ip}`, 10, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Honeypot check
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    // 3. Settings validation: Open status, Deadline & Max Capacity
    const settings = await getGlobalSettings();

    if (!settings.registrationOpen) {
      return NextResponse.json(
        { error: "Expothon registrations are currently closed by the organizing committee." },
        { status: 400 }
      );
    }

    if (settings.registrationDeadline) {
      const deadline = new Date(settings.registrationDeadline);
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: "The registration deadline for Expothon has passed." },
          { status: 400 }
        );
      }
    }

    const conn = await connectToDatabase();
    const isOnline = conn && isDatabaseConnected();

    if (settings.maxCapacity && isOnline) {
      try {
        const currentCount = await Registration.countDocuments();
        if (currentCount >= settings.maxCapacity) {
          return NextResponse.json(
            { error: "Registration capacity limit reached. Please contact coordinators for waitlist options." },
            { status: 400 }
          );
        }
      } catch (e) {
        // Fallback
      }
    }

    // 4. Validate payload with Zod
    const validatedData = RegistrationFormSchema.parse(body);

    // 5. Prevent Duplicates (Same lead email + same project title)
    if (isOnline) {
      try {
        const existingSubmission = await Registration.findOne({
          "leadMember.email": validatedData.leadMember.email.toLowerCase(),
          projectTitle: { $regex: new RegExp(`^${validatedData.projectTitle.trim()}$`, "i") },
        });

        if (existingSubmission) {
          return NextResponse.json(
            {
              error: `A project titled "${validatedData.projectTitle}" has already been submitted under email ${validatedData.leadMember.email}. Use the status lookup portal with your Registration ID (${existingSubmission.registrationId}).`,
            },
            { status: 409 }
          );
        }
      } catch (e) {
        // Continue
      }
    }

    // 6. Generate Unique Registration ID: EXP-2026-XXXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const edition = settings.eventEdition || "2026";
    const registrationId = `EXP-${edition}-${randomSuffix}`;

    let targetId = registrationId;

    // 7. Insert Registration Record
    if (isOnline) {
      try {
        const newReg = await Registration.create({
          registrationId,
          teamName: validatedData.teamName,
          collegeName: validatedData.collegeName,
          department: validatedData.department,
          city: validatedData.city,
          state: validatedData.state,
          yearOfStudy: validatedData.yearOfStudy,
          leadMember: validatedData.leadMember,
          teamMembers: validatedData.teamMembers,
          projectTitle: validatedData.projectTitle,
          trackId: validatedData.trackId,
          abstractText: validatedData.abstractText,
          hardwareComponents: validatedData.hardwareComponents,
          projectStage: validatedData.projectStage,
          demoUrl: validatedData.demoUrl || "",
          requirements: validatedData.requirements,
          mentorDetails: validatedData.mentorDetails,
          abstractFileUrl: validatedData.abstractFileUrl,
          posterFileUrl: validatedData.posterFileUrl || "",
          status: "Submitted",
          adminRemarks: "Your project abstract has been received and entered into the technical evaluation queue.",
        });
        targetId = newReg._id.toString();
      } catch (createErr) {
        console.warn("DB write failed, falling back to memory store:", createErr);
        addMemoryRegistration({
          registrationId,
          teamName: validatedData.teamName,
          collegeName: validatedData.collegeName,
          department: validatedData.department,
          city: validatedData.city,
          state: validatedData.state,
          yearOfStudy: validatedData.yearOfStudy,
          leadMember: validatedData.leadMember,
          teamMembers: validatedData.teamMembers,
          projectTitle: validatedData.projectTitle,
          trackId: validatedData.trackId,
          abstractText: validatedData.abstractText,
          hardwareComponents: validatedData.hardwareComponents,
          projectStage: validatedData.projectStage,
          demoUrl: validatedData.demoUrl || "",
          requirements: validatedData.requirements,
          mentorDetails: validatedData.mentorDetails,
          abstractFileUrl: validatedData.abstractFileUrl,
          status: "Submitted",
          adminRemarks: "Your project abstract has been received and entered into the technical evaluation queue.",
        });
      }
    } else {
      addMemoryRegistration({
        registrationId,
        teamName: validatedData.teamName,
        collegeName: validatedData.collegeName,
        department: validatedData.department,
        city: validatedData.city,
        state: validatedData.state,
        yearOfStudy: validatedData.yearOfStudy,
        leadMember: validatedData.leadMember,
        teamMembers: validatedData.teamMembers,
        projectTitle: validatedData.projectTitle,
        trackId: validatedData.trackId,
        abstractText: validatedData.abstractText,
        hardwareComponents: validatedData.hardwareComponents,
        projectStage: validatedData.projectStage,
        demoUrl: validatedData.demoUrl || "",
        requirements: validatedData.requirements,
        mentorDetails: validatedData.mentorDetails,
        abstractFileUrl: validatedData.abstractFileUrl,
        status: "Submitted",
        adminRemarks: "Your project abstract has been received and entered into the technical evaluation queue.",
      });
    }

    // 8. Record in Audit Log
    await recordAuditLog({
      userEmail: validatedData.leadMember.email,
      action: "REGISTRATION_SUBMITTED",
      targetEntity: "Registration",
      targetId,
      diff: {
        registrationId,
        teamName: validatedData.teamName,
        projectTitle: validatedData.projectTitle,
        trackId: validatedData.trackId,
      },
      ipAddress: ip,
    });

    // 9. Dispatch Automatic Email to Registered Mail ID
    try {
      await sendRegistrationConfirmationEmail({
        registrationId,
        recipientEmail: validatedData.leadMember.email,
        leadName: validatedData.leadMember.name,
        teamName: validatedData.teamName,
        projectTitle: validatedData.projectTitle,
        trackId: validatedData.trackId,
        collegeName: validatedData.collegeName,
        department: validatedData.department,
        teamMembers: validatedData.teamMembers,
        eventDate: formatDateRange(settings.eventStartDate, settings.eventEndDate),
        venueName: settings.venueName,
      });
    } catch (emailErr) {
      console.error("Non-fatal email dispatch notice:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        registrationId,
        teamName: validatedData.teamName,
        projectTitle: validatedData.projectTitle,
        message: "Registration submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration submission error:", error);
    if (error.name === "ZodError") {
      const messages = error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your registration" },
      { status: 500 }
    );
  }
}
