import express from 'express';
import controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';

const router = express.Router();

// router
//   .route('/masterData')
//   .get(isAuthenticated, controller.CommonMasterController.getMasterData);
router
  .route('/events/active')
  .get(isAuthenticated, controller.CommonMasterController.getAllActiveEvents);

router.route('/get-sold-count').get(isAuthenticated, hasAdminAccess, controller.CommonMasterController.getCourseSoldCount)
router.route('/get-collection').get(isAuthenticated, hasAdminAccess, controller.CommonMasterController.getTotalCollectionByMonth)
// router.get(
//   '/syllabus/:classId/:subjectId',
//   isAuthenticated,
//   controller.CommonMasterController.getSyllabusByClassAndSubject
// );

// router
//   .route('/totalReports')
//   .get(isAuthenticated, controller.CommonMasterController.getTotalReports);

export default router;
