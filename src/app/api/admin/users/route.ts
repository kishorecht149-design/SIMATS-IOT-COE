import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import User, { UserRole } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { recordAuditLog } from "@/lib/services/audit-service";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["SUPER_ADMIN", "EDITOR", "REGISTRATION_MANAGER"]),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.warn("MongoDB offline, returning fallback admin user list:", error);
    return NextResponse.json({
      users: [
        {
          _id: "default-admin-id",
          name: "System Administrator",
          email: "admin@saveetha.simats.edu",
          role: "SUPER_ADMIN",
          isActive: true,
          createdAt: new Date().toISOString(),
        }
      ]
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const data = CreateUserSchema.parse(body);

    await connectToDatabase();
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const newUser = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      isActive: true,
    });

    await recordAuditLog({
      userId: session.userId,
      userEmail: session.email,
      action: "USER_CREATED",
      targetEntity: "User",
      targetId: newUser._id.toString(),
      diff: { name: data.name, email: data.email, role: data.role },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 400 });
  }
}
