import { Request, Response } from 'express';
import db from '../model';
import { sendResponse } from '../utils/responseUtils';

export const createYouTube = async (req: Request, res: Response) => {
  try {
    const { title, description, link, courseId } = req.body;
    if (!title || !description || !link || !courseId) {
      return sendResponse(res, 'Please fill all the details', null, false, 400);
    }
    const youtube = await db.YouTube.create({
      title,
      description,
      link,
      courseId,
    });
    if (!youtube) {
      return sendResponse(res, 'Youtube not created', null, false, 400);
    }
    return sendResponse(res, 'Youtube created successfully', youtube, true);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getYouTube = async (req: Request, res: Response) => {
  try {
    const youtube = await db.YouTube.find();
    if (!youtube) {
      return sendResponse(res, 'No YouTube found', null, false, 404);
    }
    return sendResponse(res, 'Youtube fetched successfully', youtube, true);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getYouTubeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const youtube = await db.YouTube.findById(id);
    if (!youtube) {
      return sendResponse(res, 'No YouTube found', null, false, 404);
    }
    return sendResponse(res, 'Youtube fetched successfully', youtube, true);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateYouTube = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, link, courseId } = req.body;
    if (!title || !description || !link || !courseId) {
      return sendResponse(res, 'Please fill all the details', null, false, 400);
    }
    const youtube = await db.YouTube.findByIdAndUpdate(
      id,
      { title, description, link, courseId },
      { new: true }
    );
    if (!youtube) {
      return sendResponse(res, 'Youtube not created', null, false, 400);
    }
    return sendResponse(res, 'Youtube created successfully', youtube, true);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteYouTube = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const youtube = await db.YouTube.findByIdAndDelete(id);
        if (!youtube) {
          return sendResponse(res, 'Youtube not created', null, false, 400);
        }
        return sendResponse(res, 'Youtube deleted successfully', youtube, true);
    } catch (error) {
      console.error(error);
      return sendResponse(res, 'Internal Server Error', null, false, 500);
    }
}

export const getYouTubeByCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const youtube = await db.YouTube.find({ courseId });
        if (!youtube) {
          return sendResponse(res, 'Youtube not created', null, false, 400);
        }
        return sendResponse(res, 'Youtube created successfully', youtube, true);
    } catch (error) {
      console.error(error);
      return sendResponse(res, 'Internal Server Error', null, false, 500);
    }
}