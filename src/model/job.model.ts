import mongoose, { Schema, Document } from "mongoose";

export interface JobDocument extends Document {
  id: number;
  productId: string;
  sendAt: Date;
  chatId: number;
  messageId: number;
  productDetails: string;
  channelId: string;
  channelName: string;
  date: Date;
}

const JobSchema = new Schema<JobDocument>(
  {
    id: { type: Number, required: true, unique: true },
    productId: { type: String, required: true },
    sendAt: { type: Date, required: true },
    chatId: Number,
    messageId: Number,
    productDetails: String,
    channelId: String,
    channelName: String,
    date: Date,
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<JobDocument>("Job", JobSchema);
