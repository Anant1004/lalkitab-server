// import mongoose, { Document, Schema } from 'mongoose';

// export interface IPayment extends Document {
//     razorpay_order_id: string;
//     razorpay_payment_id: string;
//     razorpay_signature: string;
// }

// const paymentSchema = new Schema<IPayment>(
//   {
//     razorpay_order_id: { type: String, required: true },
//     razorpay_payment_id: { type: String, required: true },
//     razorpay_signature: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

// export default Payment;


import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: Schema.Types.ObjectId;
  purchaseId: Schema.Types.ObjectId;
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  paymentProof?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purchaseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Purchase',
      required: true
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
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
