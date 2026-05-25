import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    /** @deprecated Legacy field; login may match email until account is recreated */
    email: { type: String, required: false },
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
