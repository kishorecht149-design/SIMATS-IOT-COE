import connectToDatabase, { isDatabaseConnected } from "@/lib/db/mongodb";
import User, { IUser, UserRole } from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signSessionToken, verifySessionToken, SessionPayload } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { recordAuditLog } from "@/lib/services/audit-service";

export const SESSION_COOKIE_NAME = "simats_iot_session";

export async function ensureInitialSuperAdmin(): Promise<void> {
  try {
    const conn = await connectToDatabase();
    if (!conn || !isDatabaseConnected()) return;

    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_INITIAL_EMAIL || "admin@saveetha.simats.edu";
      const password = process.env.ADMIN_INITIAL_PASSWORD || "SaveethaIoTCoE2026!";
      const passwordHash = await hashPassword(password);

      await User.create({
        name: "CoE Super Administrator",
        email: email.toLowerCase(),
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      });

      console.log(`[BOOTSTRAP] Created initial Super Admin account: ${email}`);
    }
  } catch (error) {
    console.error("Error during initial admin bootstrap:", error);
  }
}

export async function authenticateAdmin(
  email: string,
  pass: string,
  ipAddress?: string
): Promise<{ success: boolean; token?: string; user?: SessionPayload; error?: string }> {
  try {
    const defaultEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@saveetha.simats.edu").toLowerCase();
    const defaultPass = process.env.ADMIN_INITIAL_PASSWORD || "SaveethaIoTCoE2026!";

    const conn = await connectToDatabase();

    // Fallback: If DB is not connected or offline, allow bootstrap Super Admin login
    if (!conn || !isDatabaseConnected()) {
      if (email.toLowerCase() === defaultEmail && pass === defaultPass) {
        const sessionPayload: SessionPayload = {
          userId: "super-admin-dev-id",
          email: defaultEmail,
          name: "CoE Super Administrator (Local)",
          role: "SUPER_ADMIN",
        };

        const token = await signSessionToken(sessionPayload);
        return { success: true, token, user: sessionPayload };
      }
      return { success: false, error: "Invalid email or password" };
    }

    await ensureInitialSuperAdmin();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Also allow default bootstrap password match if user record hasn't synced
      if (email.toLowerCase() === defaultEmail && pass === defaultPass) {
        const sessionPayload: SessionPayload = {
          userId: "super-admin-bootstrap-id",
          email: defaultEmail,
          name: "CoE Super Administrator",
          role: "SUPER_ADMIN",
        };
        const token = await signSessionToken(sessionPayload);
        return { success: true, token, user: sessionPayload };
      }
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.isActive) {
      return { success: false, error: "This administrator account has been deactivated" };
    }

    const isValid = await verifyPassword(pass, user.passwordHash);
    if (!isValid) {
      // Check fallback bootstrap password as backup
      if (email.toLowerCase() === defaultEmail && pass === defaultPass) {
        // proceed
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const sessionPayload: SessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await signSessionToken(sessionPayload);

    await recordAuditLog({
      userId: user._id.toString(),
      userEmail: user.email,
      action: "ADMIN_LOGIN",
      targetEntity: "User",
      targetId: user._id.toString(),
      ipAddress,
    });

    return { success: true, token, user: sessionPayload };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication system error occurred" };
  }
}

export async function authenticateGoogleUser(
  profile: {
    email: string;
    name: string;
    picture?: string;
    sub?: string;
  },
  ipAddress?: string
): Promise<{ success: boolean; token?: string; user?: SessionPayload; error?: string }> {
  try {
    const email = profile.email.toLowerCase().trim();
    const defaultEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@saveetha.simats.edu").toLowerCase();

    const conn = await connectToDatabase();

    let role: UserRole = "EDITOR";
    if (email === defaultEmail || email.startsWith("admin@")) {
      role = "SUPER_ADMIN";
    }

    if (!conn || !isDatabaseConnected()) {
      const sessionPayload: SessionPayload = {
        userId: `google-${profile.sub || "user"}-${Date.now()}`,
        email,
        name: profile.name || email.split("@")[0],
        role,
      };
      const token = await signSessionToken(sessionPayload);
      return { success: true, token, user: sessionPayload };
    }

    await ensureInitialSuperAdmin();

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-provision staff member authenticated via Google
      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        passwordHash: await hashPassword(Math.random().toString(36) + Date.now().toString(36)),
        role,
        isActive: true,
      });
      console.log(`[AUTH] Auto-provisioned Google user account: ${email} (${role})`);
    }

    if (!user.isActive) {
      return { success: false, error: "This administrator account has been deactivated" };
    }

    user.lastLoginAt = new Date();
    await user.save();

    const sessionPayload: SessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await signSessionToken(sessionPayload);

    await recordAuditLog({
      userId: user._id.toString(),
      userEmail: user.email,
      action: "GOOGLE_SSO_LOGIN",
      targetEntity: "User",
      targetId: user._id.toString(),
      ipAddress,
    });

    return { success: true, token, user: sessionPayload };
  } catch (error) {
    console.error("Google authentication error:", error);
    return { success: false, error: "Google authentication processing error" };
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

