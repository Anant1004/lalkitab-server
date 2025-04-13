import express from 'express';
import Controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';

const router = express.Router();


router.post('/create',isAuthenticated,hasAdminAccess, Controller.EventController.createEvent);
router.get('/all', isAuthenticated, Controller.EventController.getEvents);
router.get('/:eventId', isAuthenticated,hasAdminAccess, Controller.EventController.getEventById);
router.put('/:eventId', isAuthenticated,hasAdminAccess, Controller.EventController.updateEvent);
router.delete('/:eventId', isAuthenticated,hasAdminAccess, Controller.EventController.deleteEvent);
router.get('/all/eventdates', isAuthenticated,hasAdminAccess, Controller.EventController.getEventDates);

export default router;
