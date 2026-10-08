import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { getMemoryRegistrations } from "@/lib/services/registration-store";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "REGISTRATION_MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const track = searchParams.get("track") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");

  try {
    const conn = await connectToDatabase();
    if (!conn || !isDatabaseConnected()) {
      throw new Error("DB offline");
    }

    const query: any = {};
    if (status && status !== "all") query.status = status;
    if (track && track !== "all") query.trackId = track;

    if (search) {
      query.$or = [
        { registrationId: { $regex: search, $options: "i" } },
        { teamName: { $regex: search, $options: "i" } },
        { collegeName: { $regex: search, $options: "i" } },
        { projectTitle: { $regex: search, $options: "i" } },
        { "leadMember.name": { $regex: search, $options: "i" } },
        { "leadMember.email": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    // Memory fallback
    let all = getMemoryRegistrations();
    if (status && status !== "all") {
      all = all.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }
    if (track && track !== "all") {
      all = all.filter((r) => r.trackId === track);
    }
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (r) =>
          r.registrationId.toLowerCase().includes(q) ||
          r.teamName.toLowerCase().includes(q) ||
          r.collegeName.toLowerCase().includes(q) ||
          r.projectTitle.toLowerCase().includes(q) ||
          r.leadMember?.name?.toLowerCase().includes(q) ||
          r.leadMember?.email?.toLowerCase().includes(q)
      );
    }

    const total = all.length;
    const skip = (page - 1) * limit;
    const registrations = all.slice(skip, skip + limit);

    return NextResponse.json({
      registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  }
}
