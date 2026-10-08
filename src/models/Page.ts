import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISectionBlock {
  id: string;
  type: string; // e.g. 'hero', 'text_image', 'tracks_grid', 'timeline', 'card_grid', 'faq_accordion', 'downloads', 'judging_criteria', 'awards_prizes', 'rich_text'
  enabled: boolean;
  order: number;
  data: Record<string, any>;
}

export interface IPage extends Document {
  slug: string; // e.g. 'home', 'about', 'expothon', 'contact', 'privacy', 'terms', 'code-of-conduct'
  title: string;
  metaDescription: string;
  status: "draft" | "published";
  version: number;
  sections: ISectionBlock[];
  updatedBy?: mongoose.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SectionBlockSchema = new Schema<ISectionBlock>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    version: { type: Number, default: 1 },
    sections: [SectionBlockSchema],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export interface IPageRevision extends Document {
  pageId: mongoose.Types.ObjectId;
  slug: string;
  version: number;
  sections: ISectionBlock[];
  updatedBy?: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
}

const PageRevisionSchema = new Schema<IPageRevision>(
  {
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: true },
    slug: { type: String, required: true },
    version: { type: Number, required: true },
    sections: [SectionBlockSchema],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PageRevision: Model<IPageRevision> =
  mongoose.models.PageRevision || mongoose.model<IPageRevision>("PageRevision", PageRevisionSchema);

export default Page;
