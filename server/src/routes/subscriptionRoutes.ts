import { Router } from 'express';
import { subscribe, getSubscriptions } from '../controllers/subscriptionController';

const router = Router();

router.post('/', subscribe);
router.get('/:userId', getSubscriptions);

export default router;
