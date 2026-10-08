import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userEmail: string;
  action: string; // e.g., 'PAGE_UPDATED', 'STATUS_CHANGED', 'USER_CREATED', 'SETTINGS_UPDATED', 'REGISTRATION_DELETED'
  targetEntity: string; // e.g., 'Page', 'Registration', 'Settings', 'User'
  targetId?: string;
  diff?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    targetEntity: { type: String, required: true, index: true },
    targetId: { type: String, default: "" },
    diff: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
