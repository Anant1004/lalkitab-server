import express from 'express';
import  Controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';

const router = express.Router();

router.post('/create',isAuthenticated,hasAdminAccess, Controller.NoticeController.createNotice);
router.get('/all', isAuthenticated,hasAdminAccess, Controller.NoticeController.getAllNotices);
router.get('/:id', isAuthenticated,hasAdminAccess, Controller.NoticeController.getNoticeById);
router.put('/:id', isAuthenticated,hasAdminAccess, Controller.NoticeController.updateNotice);
router.delete('/:id', isAuthenticated,hasAdminAccess, Controller.NoticeController.deleteNotice);

export default router;
