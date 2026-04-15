import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FormSubmissionSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["contact", "quote"], index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export type FormSubmissionDoc = InferSchemaType<typeof FormSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FormSubmission: Model<FormSubmissionDoc> =
  (mongoose.models.FormSubmission as Model<FormSubmissionDoc>) ||
  mongoose.model<FormSubmissionDoc>("FormSubmission", FormSubmissionSchema);
