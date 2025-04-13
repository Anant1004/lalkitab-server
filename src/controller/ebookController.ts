import { NextFunction, Request, Response } from 'express';
import Ebook from '../model/ebookModle';
import { sendResponse } from '../utils/responseUtils';
import { uploadToCloudinary } from '../utils/storage';
import { error } from 'console';

interface MulterRequest extends Request {
  files: any;
}

export const createEbook = async (req: MulterRequest, res: Response) => {
  try {
    const {
      title,
      description,
      author,
      category,
      tags,
      // classId,
      // subjectId,
      // language,
      price,
      status,
    } = req.body;

    if (!req.files) throw error('No file uploaded');
    const locaFilePath = req.files.uploadedFile[0].path;
    const locaFilePath2 = req.files.thumbnailUrl[0].path;

    if (!title || !description || !author || !category || !status) {
      return sendResponse(
        res,
        'Please fill in all required ebook details',
        null,
        false,
        400
      );
    }

    const cloudinaryResult = await uploadToCloudinary(locaFilePath);
    const cloudinaryResult2 = await uploadToCloudinary(locaFilePath2);

    const ebook = new Ebook({
      title,
      description,
      author,
      category,
      tags,
      // language: language || 'English',
      thumbnailUrl:
        cloudinaryResult2.url ||
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      fileUrl:
        cloudinaryResult.url ||
        'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      price,
      status,
    });

    const newEbook = await ebook.save();

    return sendResponse(res, 'Ebook created successfully', newEbook);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllEbooks = async (req: Request, res: Response) => {
  try {
    const ebooks = await Ebook.find().select('-createdAt -updatedAt -__v');
    return sendResponse(res, 'Ebooks retrieved successfully', ebooks);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllEbooksbyCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const ebooks = await Ebook.find({ category }).select(
      '-createdAt -updatedAt -__v'
    );
    if (!ebooks) {
      return sendResponse(res, 'Ebook not found', null, false, 404);
    }
    return sendResponse(res, 'Ebooks retrieved successfully', ebooks);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getEbookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ebook = await Ebook.findById(id).select('-createdAt -updatedAt -__v');
    if (!ebook) {
      return sendResponse(res, 'Ebook not found', null, false, 404);
    }
    return sendResponse(res, 'Ebook retrieved successfully', ebook);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateEbook = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      author,
      category,
      tags,
      // classId,
      // subjectId,
      // language,
      price,
      status,
    } = req.body;

     if (!req.files) throw error('No file uploaded');
     const locaFilePath = req.files.uploadedFile[0].path;
     const locaFilePath2 = req.files.thumbnailUrl[0].path;

     const cloudinaryResult = await uploadToCloudinary(locaFilePath);
     const cloudinaryResult2 = await uploadToCloudinary(locaFilePath2);

    const ebook = await Ebook.findByIdAndUpdate(
      id,
      {
        title,
        description,
        author,
        category,
        tags,
        // classId,
        thumbnailUrl:cloudinaryResult2.url,
        fileUrl:cloudinaryResult.url,
        price,
        status,
      },
      { new: true }
    );

    if (!ebook) {
      return sendResponse(res, 'Ebook not found', null, false, 404);
    }

    return sendResponse(res, 'Ebook updated successfully', ebook);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteEbook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ebook = await Ebook.findByIdAndDelete(id);
    if (!ebook) {
      return sendResponse(res, 'Ebook not found', null, false, 404);
    }
    return sendResponse(res, 'Ebook deleted successfully', null);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};
