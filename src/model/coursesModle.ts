import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: 'live' | 'recorded' | 'topup';
  status: 'paid'| 'free';
  thumbnailUrl?: string; 
  tags?: string[]; 
  language?: string;
  rating?: number; 
  syllabusUrl?: string;
  duration?: number;
  durationUnit?: 'hours' | 'days' | 'weeks' | 'months';
  lectureCount?:number;
  lectureDuration:number;
  price: number;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['live', 'recorded', 'topup'] },
    status: { type: String, enum: ['paid', 'free'], required: true },
    thumbnailUrl: { type: String, default:'https://pathfinder.edu.in/wp-content/themes/pathfinder/assets/images/default-course-image.png'},
    tags: { type: [String], required: true },
    language: { type: String },
    rating: { type: Number, default:4 },
    syllabusUrl: { type: String },
    duration: { type: Number },
    durationUnit: { type: String, enum: ['hours', 'days', 'weeks', 'months'] },
    lectureCount:{type:Number,},
    lectureDuration:{type:Number},
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
