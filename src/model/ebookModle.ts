import mongoose, { Document, Schema } from 'mongoose';

export interface IEbook extends Document {
  title: string;
  description: string
  author: string;
  category: string;
  tags?: string[]; 
  // classId:Schema.Types.ObjectId;
  // subjectId: Schema.Types.ObjectId;
  // language: string;
  thumbnailUrl?: string;
  fileUrl: string;
  price?: number;
  status: 'available' | 'unavailable';
  rating?: number;
  reviews?: string[];
}

const ebookSchema = new Schema<IEbook>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: false },
    // courseId: { type: mongoose.Types.ObjectId, ref: 'Classes', required: true },
    // subjectId: { type: mongoose.Types.ObjectId, ref: 'Subjects', required: true },
    // language: { type: String ,default:'English'},
    thumbnailUrl: { type: String ,default:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' },
    fileUrl: { type: String, required: true },
    status: { type: String, enum: ['available', 'unavailable'], required: true },
    rating: { type: Number },   
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Ebook = mongoose.model<IEbook>('Ebook', ebookSchema);

export default Ebook;
