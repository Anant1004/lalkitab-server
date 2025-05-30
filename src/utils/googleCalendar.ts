import { google, calendar_v3 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse } from './responseUtils';
import { Request, Response } from 'express';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Credentials and calendar ID
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS || '{}');
const CALENDAR_ID = 'shouryajain0708@gmail.com';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar',
];

// Google Auth client using JWT (service account)
export const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  undefined,
  CREDENTIALS.private_key,
  SCOPES
);

// List events from Google Calendar
export const listEvents = async (req: Request, res: Response) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const now = new Date().toISOString();
    const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now,
      timeMax: sevenDaysLater,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'Asia/Kolkata',
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return sendResponse(res, 'No upcoming events found.', [], true, 200);
    }

    const formattedEvents = events.map(event => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;

      return {
        summary: event.summary || 'No title',
        description: event.description || 'No description',
        startDate: start,
        start,
        endTime: end,
        meetingLink: event.hangoutLink || 'https://meet.google.com/egt-anwa-jub',
      };
    });

    return sendResponse(res, 'Events data fetched successfully', formattedEvents, true, 200);
  } catch (error) {
    console.error('Error fetching events:', error);
    return sendResponse(res, 'Failed to fetch events', null, false, 500);
  }
};

// Create a new event in Google Calendar
export const createEvent = async (req: Request, res: Response) => {
  const { summary, description, start, end } = req.body;
  if (!summary || !start || !end) {
    return sendResponse(res, 'Summary, start and end date are required', null, false, 400);
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });

    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
    });

    if (response.status === 200) {
      console.log('Event created:', response.data);
      return sendResponse(res, 'Event created successfully', response.data, true, 200);
    } else {
      console.warn('Unexpected status from Google API:', response.status, response.statusText);
      return sendResponse(res, 'Failed to create event', null, false, response.status);
    }
  } catch (error: any) {
    console.error('Error creating event:', error);
    const message = error?.errors?.[0]?.message || error.message || 'Internal Server Error';
    return sendResponse(res, message, null, false, 500);
  }
};

// Update an existing event
export const updateEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { summary, description, start, end } = req.body;

  if (!summary || !start || !end) {
    return sendResponse(res, 'Summary, start and end date are required', null, false, 400);
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });

    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId,
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return sendResponse(res, 'Event updated successfully', response.data, true, 200);
  } catch (error: any) {
    console.error('Error updating event:', error);
    const message = error?.errors?.[0]?.message || error.message || 'Failed to update event';
    return sendResponse(res, message, null, false, 500);
  }
};

// Delete an event by eventId (optional)
export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  if (!eventId) {
    return sendResponse(res, 'Event ID is required', null, false, 400);
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId,
    });

    return sendResponse(res, 'Event deleted successfully', null, true, 200);
  } catch (error: any) {
    console.error('Error deleting event:', error);
    const message = error?.errors?.[0]?.message || error.message || 'Failed to delete event';
    return sendResponse(res, message, null, false, 500);
  }
};
