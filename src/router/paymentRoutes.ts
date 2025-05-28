// import express from 'express';
// import controller from '../controller';

// const router = express.Router();

// router.route('/checkout').post(controller.PaymentController.checkout);
// router.route('/verification').post(controller.PaymentController.paymentVerification);

// export default router;
// 


import express from 'express';
import controller from '../controller'; // controller index file jisme PaymentController export ho
import { uploadFile } from '../utils/storage';

const router = express.Router();

// POST /api/payments → create payment
router.route('/').post(uploadFile('paymentProof'),controller.PaymentController.createPayment);

// GET /api/payments → get all payments
router.route('/').get(controller.PaymentController.getPayments);

// GET /api/payments/:id → get single payment by id
// PUT /api/payments/:id → update payment (status/proof etc)
// DELETE /api/payments/:id → delete payment
router
  .route('/:id')
  .get(controller.PaymentController.getPaymentById)
  .put(controller.PaymentController.updatePayment)
  .delete(controller.PaymentController.deletePayment);

export default router;
