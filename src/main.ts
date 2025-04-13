import app from './app';
import {connectDB} from "./config/db"
import dotenv from 'dotenv';
import { createEvent,listEvents} from "./utils/googleCalendar"
const PORT = process.env.PORT;
dotenv.config();
const eventDetails = {
  summary: 'Meeting with Amar',
  description: 'Discuss project updates',
  start: '2024-08-02T11:00:00+05:30',
  end: '2024-08-02T12:00:00+05:30',
};

connectDB();
app.listen(PORT, async() => {
  console.log(`listening at port http://localhost:${PORT}`);
});
