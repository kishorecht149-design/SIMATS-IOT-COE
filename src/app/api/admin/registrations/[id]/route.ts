import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { recordAuditLog } from "@/lib/services/audit-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "REGISTRATION_MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await connectToDatabase();

  const reg = await Registration.findById(id).lean();
  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json({ registration: reg });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "REGISTRATION_MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    const reg = await Registration.findById(id);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const updates: any = {};

    if (body.status) {
      updates.status = body.status;
    }
    if (body.adminRemarks !== undefined) {
      updates.adminRemarks = body.adminRemarks;
    }
    if (body.checkedIn !== undefined) {
      updates.checkedIn = body.checkedIn;
      updates.checkedInAt = body.checkedIn ? new Date() : null;
    }

    if (body.newInternalNote) {
      reg.internalNotes.push({
        note: body.newInternalNote,
        addedBy: session.name || session.email,
        addedAt: new Date(),
      });
    }

    Object.assign(reg, updates);
    await reg.save();

    await recordAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: "REGISTRATION_STATUS_UPDATED",
      targetEntity: "Registration",
      targetId: reg._id.toString(),
      diff: {
        registrationId: reg.registrationId,
        newStatus: reg.status,
        remarks: reg.adminRemarks,
      },
    });

    return NextResponse.json({ success: true, registration: reg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Super Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  await connectToDatabase();

  const reg = await Registration.findByIdAndDelete(id);
  if (reg) {
    await recordAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: "REGISTRATION_DELETED",
      targetEntity: "Registration",
      targetId: id,
      diff: { registrationId: reg.registrationId, teamName: reg.teamName },
    });
  }

  return NextResponse.json({ success: true });
}
