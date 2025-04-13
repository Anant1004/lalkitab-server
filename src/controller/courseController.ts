import { Request, Response, NextFunction } from 'express';
import Course from '../model/coursesModle';
import { sendResponse } from '../utils/responseUtils';
import { error } from 'console';
import { uploadToCloudinary } from '../utils/storage';

interface MulterRequest extends Request {
  file?: any;
  files?: any;
}

export const createCourse = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      category,
      status,
      tags,
      language,
      price,
      rating,
      syllabusUrl,
      duration,
      durationUnit,
      lectureCount,
      lectureDuration,
    } = req.body;

    // if(!title || !description || !category || !status || !price ){
    //     return sendResponse(res, 'Please provide all required fields', null, false, 400);
    // }
    if (!req.file) throw error('No file uploaded');
    const thumbnailFile = req.file.path;
    const thumbnailUrlcloudinaryResult = await uploadToCloudinary(
      thumbnailFile
    );

    const tagsArray = tags.split(',').map((tag) => tag.trim());
    const newCourse = new Course({
      title,
      description,
      category,
      status,
      tags: tagsArray,
      language,
      price,
      thumbnailUrl: thumbnailUrlcloudinaryResult.url,
      rating,
      syllabusUrl,
      duration,
      durationUnit,
      lectureCount,
      lectureDuration,
    });

    const savedCourse = await newCourse.save();

    if (!savedCourse) {
      return sendResponse(res, 'Course not created', null, false, 400);
    }

    return sendResponse(res, 'Course created successfully', savedCourse);
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await Course.find().select(' -createdAt -updatedAt -__v');
    return sendResponse(res, 'Courses retrieved successfully', courses);
  } catch (error) {
    next(error);
  }
};

export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const courses = await Course.find({ category }).select(
      '-createdAt -updatedAt -__v'
    );

    if (!courses) {
      return sendResponse(res, 'Course not found', null, false, 404);
    }

    return sendResponse(res, 'Courses retrieved successfully', courses);
  } catch (error) {
    return sendResponse(res, 'Course not retrieved/found', null, false, 500);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .select(' -createdAt -updatedAt -__v');
    if (!course) {
      return sendResponse(res, 'Course not found', null, false, 404);
    }

    return sendResponse(res, 'Course retrieved successfully', course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    let thumbnailUrlcloudinaryResult: null | {message:string, url:any} = null;
    if (req.file) {
      const thumbnailFile = req.file.path;
      thumbnailUrlcloudinaryResult = await uploadToCloudinary(thumbnailFile);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { ...updatedData, thumbnailUrl: thumbnailUrlcloudinaryResult?.url },
      { new: true }
    );

    if (!updatedCourse) {
      return sendResponse(res, 'Course not found', null, false, 404);
    }

    return sendResponse(res, 'Course updated successfully', updatedCourse);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return sendResponse(res, 'Course not found', null, false, 404);
    }

    return sendResponse(res, 'Course deleted successfully', deletedCourse);
  } catch (error) {
    next(error);
  }
};
