import { google, calendar_v3 } from 'googleapis';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse } from './responseUtils';
import { Request, Response } from 'express';
import moment from 'moment-timezone';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Define your credentials and calendar ID
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS || '{}');
// const CALENDAR_ID = '77ce23e0d852df84ea2af654517188c0772e6cf4469d6b41cd5841f8f5f6298b@group.calendar.google.com';
const CALENDAR_ID = 'shouryajain0708@gmail.com';
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"
,"https://www.googleapis.com/auth/calendar"
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // To get a refresh token
  scope: SCOPES,
});


// Authenticate using service account
export const authenticateServiceAccount = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: SCOPES,
  });
  return await auth.getClient();
};
export const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

// const subtractOffset = (dateTime) => {
//   const date = new Date(dateTime);
//   // Subtract 5 hours and 30 minutes
//   date.setHours(date.getHours() - 5);
//   date.setMinutes(date.getMinutes() - 30);
//   return date.toISOString();
// };

export const listEvents = async (req: Request, res: Response) => {
  const calendar = google.calendar({ version: 'v3', auth });
  const now = new Date().toISOString();
  const tomorrow = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
    const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: now,
    timeMax: tomorrow,
    singleEvents: true,
    orderBy: 'startTime',
    timeZone: 'Asia/Kolkata',
  });

  const events = response?.data.items;
  if (events && events.length) {
    const formattedEvents = events.map(event => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;

      return {
        summary: event.summary || 'No title',
        description: event.description || 'No description',
        startDate: (start),
        start: (start),
        endTime: (end),
        meetingLink: event.hangoutLink || 'https://meet.google.com/egt-anwa-jub'
      };
    });
    return sendResponse(res, 'Events data fetched successfully',formattedEvents,true,200);
  }
    else {
    console.log('No upcoming events found.');
    return sendResponse(res, 'Internal Server Error', null, false, 500);

  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  const { code } = req.query; 


  const {summary,description,start ,end } = req.body;
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: summary,
    description: description,
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
    }
    }

  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
    });

    if (response.status === 200 && response.statusText === 'OK') {
      console.log(response.data);
      return sendResponse(res, 'created event Successfully', null, true, 200);
      
    } else {
      let errorMessage = 'Failed to create event.';
      switch (response.status) {
        case 400:
          errorMessage = 'Invalid request. Check event details.';
          break;
        case 403:
          errorMessage = 'Permission denied. Check service account access.';
          break;
        default:
          errorMessage = response.statusText;
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(`Error at createEvent --> ${error}`);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { summary, description, start, end } = req.body;

  if (!summary || !start || !end) {
    return res.status(400).json({ error: 'Summary, start time, and end time are required.' });
  }

  try {
    const event = {
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
    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: event,
      conferenceDataVersion: 1, 
    });

    res.status(200).json({
      message: 'Event updated successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event.' });
  }
};


// Get date-time string for calender
// const dateTimeForCalander = () => {

//     let date = new Date();

//     let year = date.getFullYear();
//     let month = date.getMonth() + 1;
//     if (month < 10) {
//         month = `0${month}`;
//     }
//     let day = date.getDate();
//     if (day < 10) {
//         day = `0${day}`;
//     }
//     let hour = date.getHours();
//     if (hour < 10) {
//         hour = `0${hour}`;
//     }
//     let minute = date.getMinutes();
//     if (minute < 10) {
//         minute = `0${minute}`;
//     }

//     let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

//     let event = new Date(Date.parse(newDateTime));

//     let startDate = event;
//     // Delay in end time is 1
//     let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

//     return {
//         'start': startDate,
//         'end': endDate
//     }
// };

// Insert new event to Google Calendar
// const insertEvent = async (event) => {

//     try {
//         let response = await calendar.events.insert({
//             auth: auth,
//             calendarId: calendarId,
//             resource: event
//         });
    
//         if (response['status'] == 200 && response['statusText'] === 'OK') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at insertEvent --> ${error}`);
//         return 0;
//     }
// };

// let dateTime = dateTimeForCalander();

// // Event for Google Calendar
// let event = {
//     'summary': `This is the summary.`,
//     'description': `This is the description.`,
//     'start': {
//         'dateTime': dateTime['start'],
//         'timeZone': 'Asia/Kolkata'
//     },
//     'end': {
//         'dateTime': dateTime['end'],
//         'timeZone': 'Asia/Kolkata'
//     }
// };

// insertEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Get all the events between two dates
// const getEvents = async (dateTimeStart, dateTimeEnd) => {

//     try {
//         let response = await calendar.events.list({
//             auth: auth,
//             calendarId: calendarId,
//             timeMin: dateTimeStart,
//             timeMax: dateTimeEnd,
//             timeZone: 'Asia/Kolkata'
//         });
    
//         let items = response['data']['items'];
//         return items;
//     } catch (error) {
//         console.log(`Error at getEvents --> ${error}`);
//         return 0;
//     }
// };


// Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

