// import { Request, Response } from 'express';
// import { instance } from '../config/payment';
// import { sendResponse } from '../utils/responseUtils';
// import crypto from 'node:crypto';
// import db from '../model';

// export const checkout = async (req: Request, res: Response) => {
//   const options = {
//     amount: Number(req.body.amount * 100),
//     currency: 'INR',
//   };

//   const order = await instance.orders.create(options);

//   return sendResponse(res, 'Order created successfully', order);
// };

// export const paymentVerification = async (req: Request, res: Response) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;
//   try {
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     const isAuthentic = expectedSignature === razorpay_signature;
//     if (isAuthentic) {
//       await db.Payment.create({
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//       });

//       return sendResponse(res, 'Verified successfully');

//       // res.redirect(`FrontURI${}`)
//     } else {
//       return sendResponse(res, 'Verification failed', null, false, 401);
//     }
//   } catch (error) {
//     return sendResponse(res, 'Internal Server Error', null, false, 500);
//   }
// };



import { Request, Response, NextFunction } from 'express';
import Payment from '../model/paymentModel';
import Purchase from '../model/purchaseModel';
import { uploadToCloudinary } from '../utils/storage';

interface MulterRequest extends Request {
  file?: any;
  files?: any;
}

export const createPayment = async ( 
  req: MulterRequest,
  res: Response,
  next: NextFunction) => {
  try {
    const { userId, purchaseId } = req.body;

    // 1. Validate purchaseId
    if (!purchaseId) {
      return res.status(400).json({ message: 'purchaseId is required' });
    }

    // 2. Check if purchase exists
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // 3. Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No payment proof uploaded' });
    }

    // 4. Upload to Cloudinary
    const uploaded = await uploadToCloudinary(req.file.path);

    // 5. Create Payment
    const newPayment = new Payment({
      userId,
      purchaseId,
      paymentProof: uploaded.url,
      paymentStatus: 'Pending',
    });

    const savedPayment = await newPayment.save();

    // 6. Update purchase status
    // purchase.purchaseStatus = 'Completed';
    await purchase.save();

    // 7. Respond
    res.status(201).json({
      message: 'Payment created and purchase marked as Completed',
      payment: savedPayment,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Payment creation failed', error });
  }
};

// Get All Payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')       // user ke kuch fields populate karo
      .populate('purchaseId')                 // purchase details populate karo
      .exec();

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error });
  }
};

// Get Payment By ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'name email')
      .populate('purchaseId')
      .exec();

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment', error });
  }
};

// Update Payment (For example update paymentStatus or paymentProof)
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const updateData = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment', error });
  }
};

// Delete Payment
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payment', error });
  }
};
