import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import { getGlobalSettings, updateGlobalSettings } from "@/lib/services/settings-service";
import { SettingsUpdateSchema } from "@/lib/validations/settings";
import { recordAuditLog } from "@/lib/services/audit-service";

export async function GET() {
  const settings = await getGlobalSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin role required." }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = SettingsUpdateSchema.parse(body);

    const updated = await updateGlobalSettings(validatedData);

    await recordAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: "SETTINGS_UPDATED",
      targetEntity: "Settings",
      diff: validatedData,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 400 }
    );
  }
}
