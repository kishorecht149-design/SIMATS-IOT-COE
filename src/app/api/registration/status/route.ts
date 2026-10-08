import { NextRequest, NextResponse } from "next/server";
import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { getMemoryRegistrations } from "@/lib/services/registration-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, email } = body;

    if (!registrationId || !email) {
      return NextResponse.json(
        { error: "Both Registration ID and Team Lead Email are required" },
        { status: 400 }
      );
    }

    const cleanRegId = registrationId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    let reg: any = null;

    try {
      const conn = await connectToDatabase();
      if (conn && isDatabaseConnected()) {
        reg = await Registration.findOne({
          registrationId: cleanRegId,
          "leadMember.email": cleanEmail,
        }).lean();
      }
    } catch (dbErr) {
      reg = null;
    }

    if (!reg) {
      const memList = getMemoryRegistrations();
      reg = memList.find(
        (r) =>
          r.registrationId.toUpperCase() === cleanRegId &&
          r.leadMember?.email?.toLowerCase() === cleanEmail
      );
    }

    if (!reg) {
      return NextResponse.json(
        { error: "No matching registration record found. Please verify your Registration ID and Team Lead Email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        registrationId: reg.registrationId,
        teamName: reg.teamName,
        collegeName: reg.collegeName,
        projectTitle: reg.projectTitle,
        trackId: reg.trackId,
        projectStage: reg.projectStage,
        status: reg.status,
        adminRemarks: reg.adminRemarks || "Under evaluation.",
        submittedAt: reg.createdAt,
        memberCount: 1 + (reg.teamMembers?.length || 0),
        checkedIn: reg.checkedIn || false,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to look up registration status" }, { status: 500 });
  }
}
