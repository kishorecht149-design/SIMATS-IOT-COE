import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { getMemoryMessages, updateMemoryMessageStatus } from "@/lib/services/message-store";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error("DB offline");
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ messages: getMemoryMessages() });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body;

  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error("DB offline");
    const updated = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, message: updated });
  } catch (err) {
    updateMemoryMessageStatus(id, status);
    return NextResponse.json({ success: true });
  }
}
