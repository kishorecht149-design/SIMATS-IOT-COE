import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import { recordAuditLog } from "@/lib/services/audit-service";
import { getMemoryRegistrations, updateMemoryRegistration, deleteMemoryRegistration } from "@/lib/services/registration-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "REGISTRATION_MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const conn = await connectToDatabase();

  if (conn && isDatabaseConnected()) {
    try {
      const reg = await Registration.findById(id).lean();
      if (reg) {
        return NextResponse.json({ registration: reg });
      }
    } catch (e) {
      // Fallback
    }
  }

  const memReg = getMemoryRegistrations().find((r) => r._id === id || r.registrationId === id);
  if (!memReg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json({ registration: memReg });
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
    const conn = await connectToDatabase();

    if (conn && isDatabaseConnected()) {
      try {
        const reg = await Registration.findById(id);
        if (reg) {
          const updates: any = {};

          if (body.status) updates.status = body.status;
          if (body.adminRemarks !== undefined) updates.adminRemarks = body.adminRemarks;
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
        }
      } catch (e) {
        // Fallback
      }
    }

    const updated = updateMemoryRegistration(id, {
      status: body.status,
      adminRemarks: body.adminRemarks,
    });

    if (!updated) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: updated });
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
  const conn = await connectToDatabase();

  if (conn && isDatabaseConnected()) {
    try {
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
    } catch (e) {
      // Fallback
    }
  }

  deleteMemoryRegistration(id);
  return NextResponse.json({ success: true });
}
