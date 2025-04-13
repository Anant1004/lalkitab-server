import express from 'express';
import { uploadpdfToCloudinary, uploadToCloudinary } from '../utils/storage';
import { sendResponse } from '../utils/responseUtils';
import path from 'path';
import puppeterExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';
import ejs from 'ejs';
import db from '../model';
import cloudinary from 'cloudinary';
import { Console, error } from 'console';
import axios from 'axios';
const router = express.Router();

router.get(
  '/:userId/:courseId/:completionDate',
  async (req, res) => {
    try {
      // Extract data from request parms
      const { userId, courseId, completionDate } = req.params;

      const studentInfo = await db.User.findById(userId);
      const courseInfo = await db.Course.findById(courseId);
      if (!studentInfo) throw error('No student info found');
      if (!courseInfo) throw error('No course info found');

      const studentName = studentInfo.fullName;
      const courseName = courseInfo.title;

      // Render EJS template with provided data
      const templateData = {
        studentName,
        // courseName,
        completionDate,
      };
      const ejsFilePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'apps',
        'server',
        'src',
        'views',
        'certificate.ejs'
      );
      const html = await ejs.renderFile(ejsFilePath, templateData);

      // res.send(html);
      puppeterExtra.use(stealthPlugin());
      const browser = await puppeterExtra.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath:
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        ignoreHTTPSErrors: true,
      });

      const page = await browser.newPage();
      // Set content of the page to the rendered HTML
      await page.setViewport({ width: 1700, height: 1400 });
      await page.setContent(html, { waitUntil: 'networkidle2' });
      // Generate PDF
      const directoryPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'apps',
        'server',
        'src',
        'assets'
      );

      const todayDate = new Date().getTime();
      const pdfFilePath = path.join(
        directoryPath,
        todayDate + 'certificate.pdf'
      );

      await page.pdf({
        printBackground: true,
        path: pdfFilePath,
        format: 'A4',
      });

      // Close the browser
      await browser.close();

      // Upload PDF to Cloudinary
      const cloudinaryResult = await uploadpdfToCloudinary(pdfFilePath);
      const pdfUrl = cloudinaryResult.url;

      // Send PDF URL in response
      sendResponse(res, 'Certificate generated successfully', {
        pdfUrl,
      });
    } catch (error) {
      sendResponse(res, `error generating certificate ${error}`, null, false, 500);
    }
  }
);

export default router
