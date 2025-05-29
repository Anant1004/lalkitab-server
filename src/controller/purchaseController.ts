import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseUtils';
import db from '../model';
import { uploadToCloudinary } from '../utils/storage';
interface MulterRequest extends Request {
  file?: any;
  files?: any;
}
export const makePurchase = async (req: MulterRequest, res: Response) => {
  try {
    const { userId, courseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No payment proof uploaded' });
    }

    // 4. Upload to Cloudinary
    const uploaded = await uploadToCloudinary(req.file.path);

    const purchase = await db.Purchase.create(
      {
        userId,
        courseId,
        paymentProof: uploaded.url
      }
    );
    if (!purchase) {
      return sendResponse(res, 'Purchase failed', null, false, 401);
    }


    return sendResponse(res, "Purchase successful", purchase);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllPurchase = async (req: Request, res: Response) => {
  try {
    const purchases = await db.Purchase.find().populate("userId").populate("courseId");
    if (!purchases) {
      return sendResponse(res, 'No purchases found', null, false, 404);
    }
    return sendResponse(res, "Purchases found", purchases);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
}

export const getPurchase = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const purchases = await db.Purchase.find({ userId }).populate({ path: "userId", select: "-password" }).populate("courseId")
    if (!purchases) {
      return sendResponse(res, 'No purchases found', null, false, 404);
    }
    return sendResponse(res, "Purchases found", purchases);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
}

export const getTotalFeeCollected = async (req: Request, res: Response) => {
  try {
    const purchases = await db.Purchase.find();
    if (!purchases) {
      return sendResponse(res, 'No purchases found', 0);
    }
    let totalFee = 0;
    for (const purchase of purchases) {
      const course = await db.Course.findById(purchase.courseId)
      if (course) {
        totalFee += course.price
      }
    }
    return sendResponse(res, 'Total fee fetched', totalFee);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
}

export const validatePurchase = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params
    const purchase = await db.Purchase.findOne({ userId, courseId })
    if (!purchase) {
      return sendResponse(res, 'No purchase found', null, false, 404);
    }
    return sendResponse(res, "Purchase found", purchase);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
}