import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import { sendRegistrationConfirmationEmail } from "@/lib/services/email-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
    }

    const body = await request.json();
    const targetEmail = body.email || session.email;

    const result = await sendRegistrationConfirmationEmail({
      registrationId: "EXP-2026-TEST",
      recipientEmail: targetEmail,
      leadName: session.name || "Test Lead",
      teamName: "Test Diagnostic Team",
      projectTitle: "Automated Email Verification Test",
      trackId: "track-1",
      collegeName: "Saveetha School of Engineering, SIMATS",
      department: "ECE",
      eventDate: "November 04, 2026",
      venueName: "IoT Centre of Excellence Lab, SSE",
    });

    return NextResponse.json({
      success: result.success,
      provider: result.provider || "none (simulated)",
      simulated: result.simulated ?? false,
      messageId: result.messageId,
      error: result.error,
      recipient: targetEmail,
      envConfigured: {
        hasResendKey: Boolean(process.env.RESEND_API_KEY),
        hasGmail: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
        hasSmtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to dispatch test email" }, { status: 500 });
  }
}
