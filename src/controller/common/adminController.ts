import { Request, Response } from 'express';
import { sendResponse } from '../../utils/responseUtils';
import db from '../../model';

//.Teachers notices
export const getAllAdminNotices = async (req: Request, res: Response) => {
  try {
    const notices = await db.Notice.find({
      recipients: { $in: ['admin', 'both'] },
    })
      .select(' -updatedAt -__v')
      .sort({ noticeDate: -1 });

    return sendResponse(res, 'Admin Notices fetched successfully', notices);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};


