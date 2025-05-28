import express from 'express';
import controller from '../controller';
import isAuthenticated, { hasAdminAccess } from '../middlewares/auth';
import { uploadFile } from '../utils/storage';

const router = express.Router();

router.route('/make-payment').post(isAuthenticated,uploadFile('paymentProof'),controller.PurchaseController.makePurchase);
router.route('/get-all-purchase').get(isAuthenticated,hasAdminAccess,controller.PurchaseController.getAllPurchase);
router.route('/get-purchase/:userId').get(isAuthenticated,controller.PurchaseController.getPurchase);
router.route('/get-total-collection').get(isAuthenticated,hasAdminAccess,controller.PurchaseController.getTotalFeeCollected);
router.route('/validate/:userId/:courseId').get(isAuthenticated,controller.PurchaseController.validatePurchase)

export default router;
