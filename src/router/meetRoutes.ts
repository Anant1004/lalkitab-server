import express from 'express';
import isAuthenticated from '../middlewares/auth';
import { createEvent,listEvents,updateEvent} from "../utils/googleCalendar"

const router = express.Router();

router.post(
  '/create',
  isAuthenticated,
  createEvent
);

router.get(
  '/get-all',
  isAuthenticated,
  listEvents
);
router.put(
    '/events/:eventId',
    isAuthenticated,
    updateEvent
  );

export default router;
