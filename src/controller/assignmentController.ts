import { Request, Response } from 'express';
import db from '../model';
import { sendResponse } from '../utils/responseUtils';
import { uploadToCloudinary } from '../utils/storage';
import { error } from 'console';

interface MulterRequest extends Request {
  file: any;
}

export const createAssignment = async (req: MulterRequest, res: Response) => {
  try {
    const { title, description, courseId } = req.body;
    console.log(req.body)
    if (!req.file) throw error('no file uploaded')
    const locaFilePath = req.file.path;
    if (
      !title ||
      !description ||
      !courseId
    ) {
      return sendResponse(
        res,
        'Please fill in all assignment details',
        null,
        false,
        400
      );
    }

    const cloudinaryResult = await uploadToCloudinary(locaFilePath);

    const assignmentData = new db.Assignment({
      title,
      description,
      courseId,
      uploadedFileUrl: cloudinaryResult.url,
    });

    const newAssignment = await assignmentData.save();
    return sendResponse(res, 'Assignment created successfully', newAssignment);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await db.Assignment.find().populate('courseId','title')
    if(!assignments){
      return sendResponse(res, 'No assignments found', null, false, 404);
    }

    return sendResponse(
      res,
      'Assignments fetched successfully',
      assignments ,
      true,
      200
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.assignmentId;
    console.log(assignmentId);
    const assignment = await db.Assignment.findById(assignmentId).select(
      '-__v -updatedAt -createdAt'
    );
    if (!assignment) {
      return sendResponse(res, 'Assignment not found', null, false, 404);
    }
    return sendResponse(res, 'Assignment fetched successfully', assignment);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAssignmentByCourseId = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const assignment = await db.Assignment.find({ courseId })
      .populate('courseId','title')
    if (!assignment) {
      return sendResponse(res, 'Assignment not found', null, false, 404);
    }
    return sendResponse(res, 'Assignment fetched successfully', assignment);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.assignmentId;
    const updatedAssignment = await db.Assignment.findByIdAndUpdate(
      assignmentId,
      req.body,
      { new: true }
    );
    if (!updatedAssignment) {
      return sendResponse(res, 'Assignment not found', null, false, 404);
    }
    return sendResponse(
      res,
      'Assignment updated successfully',
      updatedAssignment,
      true,
      200
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.assignmentId;
    const deletedAssignment = await db.Assignment.findByIdAndDelete(
      assignmentId
    );
    if (!deletedAssignment) {
      return sendResponse(res, 'Assignment not found', null, false, 404);
    }
    return sendResponse(
      res,
      'Assignment deleted successfully',
      null,
      true,
      200
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};
