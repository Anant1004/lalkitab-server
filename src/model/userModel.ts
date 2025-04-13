// Import Dependencies
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '../utils/constants';

interface IUser extends Document {
  profileImage: string;
  email: string;
  fullName: string;
  password: string;
  mobileNo: number;
  gender?: string;
  role: string;
  address: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  isValidatedPassword(
    usersendPassword: string,
    password: string
  ): Promise<boolean>;
  getForgotPasswordToken(): string;
  getJwtToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    profileImage: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFJfQpO3v4NSrlVvMpFYWw7YjijzAKTbuXHg&s',
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please enter email in correct format'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your name'],
      maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password should be of atleast 6 characters.'],
    },
    mobileNo: {
      type: Number,
      unique: true,
      required: [true, 'Please provide a mobile number'],
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      default: Role.USER,
    },
    address: {
      type: String,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (
  usersendPassword: string,
  password: string
) {
  return await bcrypt.compare(usersendPassword, password);
};

// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

// generate forget password token (string)
userSchema.methods.getForgotPasswordToken = function () {
  // generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString('hex');

  // getting a hash - make sure to get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash('sha256')
    .update(forgotToken)
    .digest('hex');

  // time of token
  this.forgotPasswordExpiry = Date.now() + 60 * 60 * 1000; // 60 mins to expire password reset token

  return forgotToken;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
