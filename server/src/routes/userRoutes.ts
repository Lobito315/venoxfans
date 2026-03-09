import { Router } from 'express';
import { getProfile, getTrendingCreators, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/trending', getTrendingCreators);
router.put('/profile', updateProfile);
router.get('/:username', getProfile);

export default router;
