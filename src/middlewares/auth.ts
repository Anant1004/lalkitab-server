import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';
import User from '../model/userModel';
import { sendResponse } from "../utils/responseUtils";

interface AuthenticatedRequest extends Request {
  user?: any; 
}

 export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next:NextFunction) => {
   // const token = req.headers['authorization'];
   const authHeader = req.headers['authorization'];
   const token = authHeader?.split(' ')[1]; //from postman  token is  sent as bearer + space + JWT....
   if (!token){
     return sendResponse(res, 'Token is requride', null, false, 403);
   }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }
    req.user = user;
    return next();
  } catch (error) {
    return sendResponse(res, 'Token is not valid, or it\'s expired', null, false, 403);
  }
}


export const hasAdminAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return sendResponse(res, 'User not found', null, false, 404);
    }

    if (user.role === 'admin') {
      return next();
    } else {
      return sendResponse(res, 'Insufficient privileges. Admin access required.', null, false, 403);
    }
  } catch (error) {
    return sendResponse(res, 'Error checking admin access', null, false, 500);
  }
}

export default isAuthenticated;