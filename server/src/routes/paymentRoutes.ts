import { Router } from 'express';
import { createOrder, captureOrder } from '../controllers/paymentController';

const router = Router();

router.post('/paypal/create-order', createOrder);
router.post('/paypal/capture-order', captureOrder);

export default router;
