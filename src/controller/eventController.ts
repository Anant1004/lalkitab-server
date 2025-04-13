import { Request, Response } from 'express';
import db from '../model';
import { sendResponse } from '../utils/responseUtils';
import { Status } from '../utils/constants';
import { format } from 'date-fns'; 

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventType,
      eventDate,
      description,
      organizer,
      location,
    } = req.body;

    if (
      !eventName ||
      !eventType ||
      !eventDate ||
      !description ||
      !organizer ||
      !location
    ) {
      return sendResponse(res, 'Please fill all the details', null, false, 400);
    }

    const newEvent = new db.SchoolEvent({
      eventName,
      eventType,
      eventDate,
      description,
      organizer,
      location,
      eventStatus: Status.ACTIVE,
    });

    await newEvent.save();

    return sendResponse(res, 'Event created successfully', {
      eventId: newEvent._id,
      eventName: newEvent.eventName,
      eventType: newEvent.eventType,
      eventDate: newEvent.eventDate,
      eventDescription: newEvent.description,
      organizer: newEvent.organizer,
      location: newEvent.location,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await db.SchoolEvent.find()
      .select('-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 });

    if (!events || events.length === 0) {
      console.log('No events found');
      return sendResponse(res, 'No events found', [], true, 200);
    }

    return sendResponse(res, 'Events fetched successfully', events , true);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};


export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return sendResponse(
        res,
        'Please provide eventId in the params',
        null,
        false,
        400
      );
    }

    const event = await db.SchoolEvent.findById(eventId).select(
      '-createdAt -updatedAt -__v'
    );

    if (!event) {
      return sendResponse(res, 'Event not found', null, false, 404);
    }

    return sendResponse(res, 'Event fetched successfully', event);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      eventName,
      eventType,
      eventDate,
      eventStatus,
      description,
      organizer,
      location,
    } = req.body;

    if (!eventId) {
      return sendResponse(
        res,
        'Please provide eventId in the params',
        null,
        false,
        400
      );
    }

    const updatedEvent = await db.SchoolEvent.findByIdAndUpdate(
      eventId,
      {
        eventName,
        eventType,
        eventDate,
        eventStatus,
        description,
        organizer,
        location,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return sendResponse(res, 'Event not found', null, false, 404);
    }

    return sendResponse(res, 'Event updated successfully', updatedEvent);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return sendResponse(
        res,
        'Please provide eventId in the params',
        null,
        false,
        400
      );
    }

    const deletedEvent = await db.SchoolEvent.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return sendResponse(res, 'Event not found', null, false, 404);
    }

    return sendResponse(res, 'Event deleted successfully', deleteEvent);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};


export const getEventDates = async (req: Request, res: Response) => {
  try {
    const events = await db.SchoolEvent.find()
    .select('eventDate')
    .sort({ eventDate: 1 }); 
    // Extract only the dates and format them to YYYY-MM-DD
    const formattedDates = events.map(event => format((event.eventDate), 'yyyy-MM-dd'));
    return sendResponse(res, 'Event dates fetched successfully', formattedDates);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};