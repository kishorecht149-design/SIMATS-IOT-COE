import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import Media from "@/models/Media";
import { getMemoryMedia, deleteMemoryMedia } from "@/lib/services/media-store";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error("DB offline");
    const media = await Media.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ media });
  } catch (err) {
    return NextResponse.json({ media: getMemoryMedia() });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Media ID required" }, { status: 400 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error("DB offline");
    await Media.findByIdAndDelete(id);
  } catch (err) {
    deleteMemoryMedia(id);
  }

  return NextResponse.json({ success: true });
}
