import { Response } from 'express';

export const sendResponse = (
  res: Response,
  message: string,
  data: any = null,
  success: boolean = true,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({ success, message, data });
};
