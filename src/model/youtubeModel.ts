import mongoose, { Document, Schema } from 'mongoose';

interface IYouTube extends Document {
  title: string;
  description: string;
  link:string
  courseId: Schema.Types.ObjectId;
}

const youTubeSchema = new Schema<IYouTube>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

const YouTube = mongoose.model<IYouTube>('YouTube', youTubeSchema);

export default YouTube;
