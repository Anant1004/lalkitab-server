import express from 'express';
import controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';
import { uploadFile } from '../utils/storage';

const router = express.Router();

router
  .route('/create')
  .post(
    isAuthenticated,
    uploadFile('uploadedFileUrl'),
    controller.AssignmentController.createAssignment
  );

  router.get('/all', isAuthenticated, controller.AssignmentController.getAllAssignments);
  
  router.get('/:assignmentId',isAuthenticated,  controller.AssignmentController.getAssignmentById);
  
  router.put('/:assignmentId', isAuthenticated, controller.AssignmentController.updateAssignmentById);
  
  router.delete('/:assignmentId', isAuthenticated, controller.AssignmentController.deleteAssignmentById);

  router.get('/get/course/:courseId',isAuthenticated,  controller.AssignmentController.getAssignmentByCourseId);


  export default router;


