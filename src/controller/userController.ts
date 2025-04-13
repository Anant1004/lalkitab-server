import { Request, Response } from 'express';
import User from '../model/userModel';
import { sendResponse } from '../utils/responseUtils';
import db from '../model';
import { uploadToCloudinary } from '../utils/storage';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, fullName, password, mobileNo, address, gender } = req.body;
    if (!email || !fullName || !password || !mobileNo || !address) {
      return sendResponse(res, 'Fill all details', null, false, 401);
    }

    if (password.length < 6) {
      return sendResponse(
        res,
        'Password must be atleast 6 characters long',
        null,
        false,
        401
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 'User exists with same email', null, false, 401);
    }

    const existingUser2 = await User.findOne({mobileNo})
    if (existingUser2) {
      return sendResponse(res, 'User exists with same mobile number', null, false, 401);
    }

    const newUser = new User({
      email,
      fullName,
      password,
      mobileNo,
      address,
      gender,
    });
    await newUser.save();
    return sendResponse(res, 'User added', {
      newUser,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 'Invalid email', null, false, 401);
    }

    const isValidPassword = await user.isValidatedPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      return sendResponse(res, 'Invalid password', null, false, 401);
    }

    const token = user.getJwtToken();
    // const userInfo = {
    //   userId: user._id,
    //   email: user.email,
    //   fullName: user.fullName,
    //   role: user.role,
    // };

    const welcomeMessage = `Welcome back, ${user.fullName}!`;

    return sendResponse(res, welcomeMessage, { token, user });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

// Forgot Password function
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }

    const resetToken = user.getForgotPasswordToken();
    await user.save();

    return sendResponse(res, 'Password reset token generated successfully', {
      resetToken,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password');

    return sendResponse(res, 'Users Data fetched successfully', users);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    const searchCriteria = {
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    };

    const users = await User.find(searchCriteria, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, {
      password: 0,
      updatedAt: 0,
      __v: 0,
    });

    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }

    return sendResponse(res, 'User Data fetched successfully', user);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

interface MulterRequest extends Request {
  file: any;
}

export const updateProfile = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const { id } = req.query;

    const locaFilePath = req.file.path;
    console.log('local filepath', locaFilePath);
    const result = await uploadToCloudinary(locaFilePath);
    const url = result.url;
    let user;
    if (url) {
      user = await User.findByIdAndUpdate(
        id,
        {
          profileImage: url,
        },
        {
          new: true,
        }
      );
    }
    return sendResponse(res, 'File Uploaded', user.profileImage);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const updateUserById = async (req: MulterRequest, res: Response) => {
  try {
    const { userId } = req.query;
    const { fullName, email, mobileNo, address, gender, password } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        mobileNo,
        address,
        gender,
        password,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }

    return sendResponse(res, 'User updated successfully', user);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const deleteUser = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.query;
    console.log(req);
    const user = await User.findByIdAndDelete(id);
    console.log(user);
    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }
    return sendResponse(res, 'User deleted successfully', user);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};
