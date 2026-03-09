import { Router } from 'express';
import { getProfile, getTrendingCreators } from '../controllers/userController';

const router = Router();

router.get('/trending', getTrendingCreators);
router.get('/:username', getProfile);

export default router;
