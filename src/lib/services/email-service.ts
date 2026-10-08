import nodemailer from "nodemailer";

export interface RegistrationEmailPayload {
  registrationId: string;
  recipientEmail: string;
  leadName: string;
  teamName: string;
  projectTitle: string;
  trackId: string;
  collegeName: string;
  department: string;
  teamMembers?: Array<{ name: string; email?: string }>;
  eventDate?: string;
  venueName?: string;
}

/**
 * Multi-provider Email Dispatcher:
 * 1. Resend API (HTTP fetch, ideal for Vercel serverless) via RESEND_API_KEY
 * 2. Gmail SMTP via GMAIL_USER + GMAIL_APP_PASSWORD (or EMAIL_USER + EMAIL_PASS)
 * 3. Custom SMTP via SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
export async function sendRegistrationConfirmationEmail(
  payload: RegistrationEmailPayload
): Promise<{ success: boolean; provider?: string; messageId?: string; simulated?: boolean; error?: string }> {
  const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://simats-iot-coe.vercel.app";
  const statusLookupUrl = `${appUrl}/registration-status?id=${encodeURIComponent(payload.registrationId)}`;
  const exhibitionDate = payload.eventDate || "November 04, 2026";
  const venue = payload.venueName || "IoT Centre of Excellence Lab, Department of ECE, Saveetha School of Engineering (SIMATS)";

  const emailSubject = `[Expothon 2026] Registration Confirmed: ${payload.registrationId} - ${payload.projectTitle}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expothon 2026 Registration Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      margin: 0;
      padding: 24px 12px;
      color: #1e293b;
    }
    .email-container {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .email-header {
      background: #003366;
      color: #ffffff;
      padding: 28px 24px;
      text-align: center;
      border-bottom: 3px solid #38bdf8;
    }
    .email-header h1 {
      margin: 0 0 6px 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .email-header p {
      margin: 0;
      font-size: 13px;
      color: #93c5fd;
      font-family: Menlo, Monaco, Consolas, monospace;
    }
    .email-body {
      padding: 28px 24px;
      line-height: 1.6;
      font-size: 14px;
    }
    .greeting {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #0f172a;
    }
    .id-box {
      background: #f8fafc;
      border: 2px dashed #0284c7;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
      margin: 20px 0;
    }
    .id-label {
      font-size: 11px;
      text-transform: uppercase;
      font-family: Menlo, Monaco, Consolas, monospace;
      color: #64748b;
      margin-bottom: 4px;
    }
    .id-val {
      font-size: 22px;
      font-weight: 800;
      font-family: Menlo, Monaco, Consolas, monospace;
      color: #003366;
      letter-spacing: 1px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    .details-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #f1f5f9;
    }
    .details-table td.label {
      font-weight: 600;
      color: #475569;
      width: 35%;
      font-family: Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      text-transform: uppercase;
    }
    .details-table td.value {
      color: #0f172a;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 20px 0;
    }
    .btn {
      display: inline-block;
      background-color: #003366;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      font-family: Menlo, Monaco, Consolas, monospace;
    }
    .notice-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      border-radius: 4px;
      margin: 20px 0;
      font-size: 12px;
      color: #1e40af;
    }
    .email-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>IoT Lab Centre of Excellence</h1>
      <p>Saveetha School of Engineering, SIMATS • Expothon 2026</p>
    </div>

    <div class="email-body">
      <div class="greeting">Dear ${payload.leadName} & Team,</div>
      <p>
        Thank you for submitting your project abstract for <strong>Expothon 2026</strong> — National-Level IoT & Embedded Systems Project Exhibition organized by the <strong>IoT Lab Centre of Excellence (CoE), Department of ECE</strong>.
      </p>

      <div class="id-box">
        <div class="id-label">Official Registration ID</div>
        <div class="id-val">${payload.registrationId}</div>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Project Title</td>
          <td class="value"><strong>${payload.projectTitle}</strong></td>
        </tr>
        <tr>
          <td class="label">Team Name</td>
          <td class="value">${payload.teamName}</td>
        </tr>
        <tr>
          <td class="label">Assigned Track</td>
          <td class="value"><strong>${payload.trackId.toUpperCase()}</strong></td>
        </tr>
        <tr>
          <td class="label">Institution</td>
          <td class="value">${payload.collegeName} (${payload.department})</td>
        </tr>
        <tr>
          <td class="label">Exhibition Date</td>
          <td class="value"><strong>${exhibitionDate}</strong></td>
        </tr>
        <tr>
          <td class="label">Venue</td>
          <td class="value">${venue}</td>
        </tr>
      </table>

      <div class="notice-box">
        <strong>Next Steps:</strong> Your submission is currently undergoing review by the Technical Evaluation Committee. Shortlist results and physical demo stall assignments will be announced on <strong>November 01, 2026</strong>.
      </div>

      <div class="btn-container">
        <a href="${statusLookupUrl}" class="btn" target="_blank">
          Check Application Status Portal →
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
        Please save this email and your <strong>Registration ID (${payload.registrationId})</strong> for all future correspondence, certificate verification, and venue entry on <strong>November 04, 2026</strong>.
      </p>
    </div>

    <div class="email-footer">
      <p><strong>IoT Lab Centre of Excellence (CoE)</strong></p>
      <p>Department of Electronics and Communication Engineering (ECE)<br>Saveetha School of Engineering, SIMATS Deemed University, Chennai - 602105</p>
      <p>Official Contact: <a href="mailto:iotcoe.ece@saveetha.com" style="color: #0284c7;">iotcoe.ece@saveetha.com</a> | +91 44 2680 1999</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
EXPOTHON 2026 - REGISTRATION CONFIRMATION
IoT Lab Centre of Excellence (CoE)
Saveetha School of Engineering, SIMATS

Dear ${payload.leadName} & Team,

Your registration for Expothon 2026 has been successfully received.

==================================================
REGISTRATION ID: ${payload.registrationId}
==================================================

PROJECT DETAILS:
- Title: ${payload.projectTitle}
- Team Name: ${payload.teamName}
- Track: ${payload.trackId.toUpperCase()}
- Institution: ${payload.collegeName} (${payload.department})
- Exhibition Date: ${exhibitionDate}
- Venue: ${venue}

NEXT STEPS:
Your abstract is in technical review. Shortlist announcements will be made on November 01, 2026.

Track your status online:
${statusLookupUrl}

Department of Electronics & Communication Engineering (ECE)
Saveetha School of Engineering, SIMATS, Chennai
Contact: iotcoe.ece@saveetha.com
  `;

  // 1. Check Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.trim() !== "") {
    try {
      const from = process.env.EMAIL_FROM || process.env.GMAIL_FROM || process.env.RESEND_FROM || "IoT CoE SIMATS <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [payload.recipientEmail],
          subject: emailSubject,
          html: htmlContent,
          text: textContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[RESEND EMAIL SENT] Confirmation sent to ${payload.recipientEmail} (ID: ${data.id})`);
        return { success: true, provider: "resend", messageId: data.id };
      } else {
        console.error("[RESEND ERROR]", data);
        const errMsg = data.message || (typeof data === "object" ? JSON.stringify(data) : String(data));
        return { success: false, provider: "resend", error: `Resend API rejected: ${errMsg}` };
      }
    } catch (resendErr: any) {
      console.error("[RESEND FETCH EXCEPTION]", resendErr.message || resendErr);
      return { success: false, provider: "resend", error: `Resend request failed: ${resendErr.message}` };
    }
  }

  // 2. Check Gmail credentials
  const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass.replace(/\s+/g, ""), // Clean space in app passwords
        },
      });

      const fromAddress = process.env.EMAIL_FROM || process.env.GMAIL_FROM || `"SIMATS IoT CoE" <${gmailUser}>`;
      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.recipientEmail,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[GMAIL SENT] Email dispatched to ${payload.recipientEmail} (Msg ID: ${info.messageId})`);
      return { success: true, provider: "gmail", messageId: info.messageId };
    } catch (gmailErr: any) {
      console.error("[GMAIL SMTP ERROR]", gmailErr.message || gmailErr);
      return { success: false, provider: "gmail", error: `Gmail SMTP failed: ${gmailErr.message}` };
    }
  }

  // 3. Check Custom SMTP
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.EMAIL_FROM || `"Saveetha IoT CoE" <${smtpUser}>`,
        to: payload.recipientEmail,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[SMTP SENT] Email sent to ${payload.recipientEmail} (Msg ID: ${info.messageId})`);
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("[SMTP ERROR]", smtpErr.message || smtpErr);
      return { success: false, provider: "smtp", error: smtpErr.message };
    }
  }

  // 4. If No Email Credentials are configured
  console.log(`\n======================================================`);
  console.log(`[AUTOMATIC EMAIL SIMULATED - NO EMAIL PROVIDER CONFIGURED]`);
  console.log(`To: ${payload.recipientEmail}`);
  console.log(`Subject: ${emailSubject}`);
  console.log(`Registration ID: ${payload.registrationId}`);
  console.log(`Project: ${payload.projectTitle}`);
  console.log(`Status Lookup: ${statusLookupUrl}`);
  console.log(`======================================================\n`);

  return { success: true, simulated: true };
}
