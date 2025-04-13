import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  uploadedFileUrl?: string;
  courseId: Schema.Types.ObjectId;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadedFileUrl: { type: String,default: "url not available"},
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;
