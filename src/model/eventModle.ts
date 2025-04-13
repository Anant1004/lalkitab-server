import mongoose, { Document, Schema } from 'mongoose';
import { Status } from '../utils/constants';


interface ISchoolEvent extends Document {
  eventName: string;
  eventType: string;
  eventDate: Date;
  description?: string;
  organizer: string;
  location: string;
  eventStatus: string;
}

const schoolEventSchema = new Schema<ISchoolEvent>(
  {
    eventName: { type: String, required: true },
    eventType: {type: String, required: true},
    eventDate: { type: Date, required: true },
    description: { type: String },
    organizer: { type: String, required: true },
    location: { type: String, required: true },
    eventStatus: { type: String, default: Status.PENDING }, 
  },
  {
    timestamps: true,
  }
);

const SchoolEvent = mongoose.model<ISchoolEvent>('SchoolEvent', schoolEventSchema);

export default SchoolEvent;
