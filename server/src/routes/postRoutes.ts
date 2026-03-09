import { Router } from 'express';
import { getFeed, getCreatorPosts, createPost } from '../controllers/postController';

const router = Router();

router.get('/feed', getFeed);
router.get('/creator/:id', getCreatorPosts);
router.post('/', createPost);

export default router;
