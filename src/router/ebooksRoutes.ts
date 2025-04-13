import express from 'express';
import Controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';
import { uploadMultiFile } from '../utils/storage';
import { uploadFile } from '../utils/storage';

const router = express.Router();

// Define routes
router.post(
  '/new/upload',
  uploadMultiFile([{
           name: 'uploadedFile', maxCount: 1
         }, {
           name: 'thumbnailUrl', maxCount: 1
         }]),
  isAuthenticated,
  hasAdminAccess,
  Controller.EbooksController.createEbook
);
router.get('/all/:category', Controller.EbooksController.getAllEbooksbyCategory);
router.get('/', Controller.EbooksController.getAllEbooks);
router.get('/:id', Controller.EbooksController.getEbookById);
router.put(
  '/:id',
  uploadMultiFile([
    {
      name: 'uploadedFile',
      maxCount: 1,
    },
    {
      name: 'thumbnailUrl',
      maxCount: 1,
    },
  ]),
  isAuthenticated,
  hasAdminAccess,
  Controller.EbooksController.updateEbook
);
router.delete('/:id',isAuthenticated,hasAdminAccess, Controller.EbooksController.deleteEbook);

export default router;
