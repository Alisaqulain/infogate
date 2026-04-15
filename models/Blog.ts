import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BlogSchema = new Schema(
  {
    title_en: { type: String, required: true },
    title_ar: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    coverImagePath: { type: String, required: false },
    content_en: { type: Schema.Types.Mixed, required: true },
    content_ar: { type: Schema.Types.Mixed, required: true },
    published: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export type BlogDoc = InferSchemaType<typeof BlogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Blog: Model<BlogDoc> =
  (mongoose.models.Blog as Model<BlogDoc>) || mongoose.model<BlogDoc>("Blog", BlogSchema);

