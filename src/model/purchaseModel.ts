import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
    userId: Schema.Types.ObjectId,
    courseId: Schema.Types.ObjectId,
    purchaseDate: Date,
    paymentStatus: 'Pending' | 'Completed' | 'Cancelled';
    paymentProof:String
}

const PurchaseSchema = new Schema<IPurchase>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        courseId: {
            type: mongoose.Types.ObjectId,
            ref: 'Courses',
            required: true
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Success', 'Failed'],
            default: 'Pending'
        },
        paymentProof: {
            type: String,
            required: true
        }
        // purchaseStatus: {
        //     type: String,
        //     enum: ['Pending', 'Completed', 'Cancelled'],
        //     default: 'Pending'
        // }
    }
)

const Purchase = mongoose.model<IPurchase>("Purchase", PurchaseSchema);

export default Purchase