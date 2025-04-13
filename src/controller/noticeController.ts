import { Request, Response } from 'express';
import Notice from '../model/noticeModle';
import { sendResponse } from '../utils/responseUtils';

export const createNotice = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return sendResponse(res, 'Please fill all the details', null, false, 400);
    }
    console.log(name, email, phone)

    const notice = new Notice({
      name,
      email,
      phone,
    });

    await notice.save();

    return sendResponse(res, 'Notice created successfully', notice);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find()
      .select('-createdAt -updatedAt -__v')
      .sort({ noticeDate: -1 });

    return sendResponse(res, 'Notices fetched successfully', notices);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id).select(
      '-createdAt -updatedAt -__v'
    );

    if (!notice) {
      return sendResponse(res, 'Notice not found', null, false, 404);
    }
    return sendResponse(res, 'Notices fetched successfully', notice);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
console.log(req.body)
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );

    console.log(updateNotice)

    if (!updatedNotice) {
      return sendResponse(res, 'Notice not found', null, false, 404);
    }

    return sendResponse(res, 'Notice updated successfully', updatedNotice);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return sendResponse(res, 'Notice not found', null, false, 404);
    }

    return sendResponse(res, 'Notice deleted successfully', deletedNotice);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};
