import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
dotenv.config();
const app = express();
import cookieParser from 'cookie-parser';
import path from 'path';

import router from './router/index';

connectDB();
//static files
export const publicDir = path.join(__dirname, 'public');

app.use('/public/uploads', express.static(path.join(publicDir, 'uploads')));
//cookies and filemiddleware
app.use(cors());
app.use(cookieParser());

// morgan middlewares
import morgan from 'morgan';
app.use(morgan('tiny'));

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running...');
  });
  

// router middleware
app.use('/api', router);


export default app;
