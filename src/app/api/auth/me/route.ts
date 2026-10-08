import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
