import exp from 'constants';
import User from './userModel';
import SchoolEvent from './eventModle';
import Notice from './noticeModle';
import Assignment from './assignmentModle';
import Ebook from './ebookModle';
import Course from './coursesModle';
import Purchase from './purchaseModel'
import Payment from './paymentModel'
import YouTube from './youtubeModel';
const db = {
  User,
  SchoolEvent,
  Notice,
  Assignment,
  Ebook,
  Course,
  Purchase,
  Payment,
  YouTube
};

export default db;
