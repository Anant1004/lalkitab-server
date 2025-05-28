import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
const { v4: uuidv4 } = require('uuid');
import fs from 'fs';
import path from 'path';
import { publicDir } from '../app';
import { Number } from 'mongoose';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//                ../../../../../../apps/server/src/public/uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(
        publicDir,
        '../public/uploads'
      )
    );
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const random = Math.floor(100000 + Math.random() * 900000);
    const fileName = `${
      uuidv4() + Date.now() + random + file.fieldname
    }.${ext}`;
    cb(null, fileName);
  },
});
var upload = multer({ storage: storage });
export const uploadFile = (fieldName: string) => upload.single(fieldName);

export const uploadMultiFile = (
  fieldName: { name: string; maxCount: number }[]
) => upload.fields(fieldName);

export async function uploadToCloudinary(locaFilePath: string) {
  var folder = 'main';
  var cloudPath = folder + locaFilePath.replace(/\\/g,'/');
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: cloudPath })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: 'Success',
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log(error);
      return { message: 'Fail', url: null };
    });
}
export async function uploadpdfToCloudinary(locaFilePath: string) {
  var folder = 'main';
  var cloudPath = folder + locaFilePath.replace(/\\/g,'/').split('D:')[1];
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: cloudPath, resource_type:'raw' })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: 'Success',
        url: result.url,
        public_id: result.public_id
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log(error);
      return { message: 'Fail', url: null, public_id: null };
    });
}

// export async function getSignedUrl(url: string) {
//   return cloudinary.v2.utils.sign_url(url, {
//         transformation: [],
//         secure: true,
//         sign_url: true,
//         expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
//       });
// }
