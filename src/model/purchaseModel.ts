import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
    userId:Schema.Types.ObjectId,
    courseId:Schema.Types.ObjectId,
    purchaseDate:Date
}

const PurchaseSchema = new Schema<IPurchase>(
    {
        userId:{
            type:mongoose.Types.ObjectId,
            ref:'Users',
            required:true
        },
        courseId:{
            type:mongoose.Types.ObjectId,
            ref:'Courses',
            required:true
        },
        purchaseDate:{
            type:Date,
            default:Date.now
        }
    }
)

const Purchase = mongoose.model<IPurchase>("Purchase",PurchaseSchema);

export default Purchase