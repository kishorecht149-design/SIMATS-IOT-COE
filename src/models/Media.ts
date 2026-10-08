import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  mimeType: string;
  fileSize: number;
  altText: string;
  category: "banner" | "gallery" | "document" | "logo" | "other";
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    altText: { type: String, default: "" },
    category: {
      type: String,
      enum: ["banner", "gallery", "document", "logo", "other"],
      default: "other",
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
