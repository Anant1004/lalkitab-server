import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://prynsh:prynsh7@mongocluster.kvqhj.mongodb.net/scmgmt';
// console.log(MONGO_URL)

// Connect Database
export const connectDB = () =>
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log(`DB Connected Succesfully.... :: ${MONGO_URL}`))
    .catch((err) => {
      console.log('DB Connection Failed!');
      console.log(err);
      process.exit(1);
    });

export default connectDB;
