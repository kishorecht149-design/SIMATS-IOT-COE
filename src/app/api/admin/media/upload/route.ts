import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import Media from "@/models/Media";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR" && session.role !== "REGISTRATION_MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "other";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: PNG, JPEG, WEBP, SVG, PDF" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64Data}`;

    await connectToDatabase();
    const newMedia = await Media.create({
      fileName: file.name,
      fileUrl: dataUri,
      mimeType: file.type,
      fileSize: file.size,
      altText: altText || file.name,
      category: category as any,
      uploadedBy: session.userId,
    });

    return NextResponse.json({
      success: true,
      media: newMedia,
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
