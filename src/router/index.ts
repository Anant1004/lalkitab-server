import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes';
import eventRoutes from './eventRoutes';
import noticeRoutes from './noticeRoutes';
import assignmentRoutes from './assignmentRoutes';
import ebooksRoutes from './ebooksRoutes';
import coursesRoutes from './cousesRoutes';
import meetRoutes from "./meetRoutes";
import commonRoutes from './commonRoutes';
import purchaseRoutes from './purchaseRoutes';
// import paymentRoutes from './paymentRoutes';
import paymentRoutes from './paymentRoutes';
import youtubeRoutes from './youtubeRoutes';
import certificateRoutes from './certificateRoutes';

router.get("/", (req, res) => {
  return res.status(200).send({
      uptime: process.uptime(),
      message: "Lal Kitab API health check :: GOOD",
      timestamp: Date.now(),
  });
});

router.use('/users', userRoutes);
router.use('/admin/meet', meetRoutes);
router.use('/admin/events', eventRoutes);
router.use('/common', commonRoutes);
router.use('/admin/notices', noticeRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/admin/ebooks',ebooksRoutes);
router.use('/admin/courses',coursesRoutes);
router.use('/payment',paymentRoutes);
router.use('/purchase',purchaseRoutes);
router.use('/youtube',youtubeRoutes);
router.use('/certificate',certificateRoutes);


export default router;
