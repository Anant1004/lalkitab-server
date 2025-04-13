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
