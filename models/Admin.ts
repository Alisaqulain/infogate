import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof AdminSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Admin: Model<AdminDoc> =
  (mongoose.models.Admin as Model<AdminDoc>) ||
  mongoose.model<AdminDoc>("Admin", AdminSchema);
