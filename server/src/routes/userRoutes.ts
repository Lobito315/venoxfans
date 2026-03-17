import { Router } from 'express';
import { getProfile, getTrendingCreators, updateProfile, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/trending', getTrendingCreators);
router.put('/profile', updateProfile);
router.delete('/profile', deleteUser);
router.get('/:username', getProfile);

export default router;
