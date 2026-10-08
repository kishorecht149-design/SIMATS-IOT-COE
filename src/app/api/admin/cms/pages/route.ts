import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import { getAllPages } from "@/lib/services/page-service";

export async function GET() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pages = await getAllPages();
  return NextResponse.json({ pages });
}
