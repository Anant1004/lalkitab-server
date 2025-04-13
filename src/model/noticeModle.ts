import mongoose, { Document, Schema } from 'mongoose';

enum Recipient {
  ADMIN = 'admin',
  USER = 'user',
  BOTH = 'both',
}
export interface INotice extends Document {
  name: string;
  email: string;
  phone: string;
}

const schoolNoticeSchema = new Schema<INotice>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model<INotice>('Notice', schoolNoticeSchema);

export default Notice;
