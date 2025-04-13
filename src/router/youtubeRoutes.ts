import express from 'express';
import Controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';

const router = express.Router();


router.post('/create', isAuthenticated,hasAdminAccess, Controller.YouTubeController.createYouTube);
router.get('/all', isAuthenticated,hasAdminAccess, Controller.YouTubeController.getYouTube);
router.get('/:id', isAuthenticated,hasAdminAccess, Controller.YouTubeController.getYouTubeById);
router.put('/:id', isAuthenticated,hasAdminAccess, Controller.YouTubeController.updateYouTube);
router.delete('/:id', isAuthenticated,hasAdminAccess, Controller.YouTubeController.deleteYouTube);
router.get('/course/:courseId', isAuthenticated, Controller.YouTubeController.getYouTubeByCourse);

export default router;
