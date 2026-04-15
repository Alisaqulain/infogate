import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PricingSchema = new Schema(
  {
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
    price: { type: String, required: true },
    features_en: { type: [String], required: true, default: [] },
    features_ar: { type: [String], required: true, default: [] },
    featured: { type: Boolean, required: true, default: false },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export type PricingDoc = InferSchemaType<typeof PricingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Pricing: Model<PricingDoc> =
  (mongoose.models.Pricing as Model<PricingDoc>) ||
  mongoose.model<PricingDoc>("Pricing", PricingSchema);

