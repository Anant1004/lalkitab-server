import { Request, Response } from 'express';
import { sendResponse } from '../../utils/responseUtils';
import db from '../../model';

//.Student list filter with section Id
export const getStudentAdmissionData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendResponse(res, 'User ID is required', null, false, 400);
    }

    const student = await db.User.findById({
      userId,
    });

    if(!student){
      return sendResponse(res, 'Student not found', null, false, 404);
    }

    return sendResponse(res, 'Student data fetched successfully', student);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

//.Students notices
export const getAllStudentsNotices = async (req: Request, res: Response) => {
  try {
    const notices = await db.Notice.find({
      recipients: { $in: ['user', 'both'] },
    })
      .select(' -updatedAt -__v')
      .sort({ noticeDate: -1 });

    return sendResponse(res, 'Students Notices fetched successfully', notices);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

//.Student subjects api by classId
//
