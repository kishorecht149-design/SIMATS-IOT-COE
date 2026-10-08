import connectToDatabase from "@/lib/db/mongodb";
import AuditLog from "@/models/AuditLog";

interface CreateAuditLogParams {
  userId?: string;
  userEmail: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  diff?: Record<string, any>;
  ipAddress?: string;
}

export async function recordAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    await connectToDatabase();
    await AuditLog.create({
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      targetEntity: params.targetEntity,
      targetId: params.targetId || "",
      diff: params.diff || {},
      ipAddress: params.ipAddress || "",
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}

export async function getAuditLogs(limit = 50, skip = 0) {
  try {
    await connectToDatabase();
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await AuditLog.countDocuments();
    return { logs, total };
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);
    return { logs: [], total: 0 };
  }
}
