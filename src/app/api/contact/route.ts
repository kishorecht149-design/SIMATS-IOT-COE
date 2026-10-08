import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  subject: z.string().min(3),
  message: z.string().min(5),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const data = ContactFormSchema.parse(body);

    await connectToDatabase();
    const newMessage = await ContactMessage.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      ipAddress: ip,
      status: "unread",
    });

    return NextResponse.json({ success: true, messageId: newMessage._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 400 });
  }
}
