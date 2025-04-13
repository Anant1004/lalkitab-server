import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;