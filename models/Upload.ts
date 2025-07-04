import mongoose, { Document, Schema } from "mongoose";

interface IUpload extends Document {
  title: string;
  url: string;
  fileId: string;
  userId: string;
  createdAt: Date;
}

const UploadSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  fileId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Upload || mongoose.model<IUpload>("Upload", UploadSchema);