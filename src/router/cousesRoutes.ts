import express from 'express';
import Controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';
import { uploadFile } from '../utils/storage';

const router = express.Router();

// Define routes
router.post(
  '/add',
  isAuthenticated,
  hasAdminAccess,
  uploadFile('thumbnailFile'),
  Controller.CoursesController.createCourse
);
router.get('/all', Controller.CoursesController.getAllCourses);
router.get(
  '/all/:category',
  Controller.CoursesController.getCoursesByCategory
);
router.get(
  '/:id',
  Controller.CoursesController.getCourseById
);
router.put(
  '/:id',
  isAuthenticated,
  hasAdminAccess,
  uploadFile('thumbnailFile'),
  Controller.CoursesController.updateCourse
);
router.delete(
  '/:id',
  isAuthenticated,
  hasAdminAccess,
  Controller.CoursesController.deleteCourse
);

export default router;
