import { Router } from 'express';
import { getFeed, getCreatorPosts, createPost, deletePost, toggleLike, addComment, getPostComments } from '../controllers/postController';

const router = Router();

router.get('/feed', getFeed);
router.get('/creator/:id', getCreatorPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);

// Like & Comment
router.post('/:id/like', toggleLike);
router.post('/:id/comment', addComment);
router.get('/:id/comments', getPostComments);

export default router;
