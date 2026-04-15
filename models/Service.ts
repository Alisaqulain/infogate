import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title_en: { type: String, required: true },
    title_ar: { type: String, required: true },
    description_en: { type: String, required: true },
    description_ar: { type: String, required: true },
    imagePath: { type: String, required: false },
  },
  { timestamps: true }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<ServiceDoc> =
  (mongoose.models.Service as Model<ServiceDoc>) ||
  mongoose.model<ServiceDoc>("Service", ServiceSchema);
