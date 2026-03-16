import { Request, Response } from 'express';
import { prisma } from '../index';
import { generatePresignedUrl, deleteObjects } from '../services/s3Service';

export const getFeed = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: {
                        select: { id: true, username: true, avatarUrl: true }
                    },
                    _count: {
                        select: { likes: true, comments: true }
                    }
                }
            }),
            prisma.post.count()
        ]);

        res.json({
            posts,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('[getFeed] Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCreatorPosts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const posts = await prisma.post.findMany({
            where: { creatorId: id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error('[getCreatorPosts] Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { creatorId, content, mediaUrls, isPremium, price } = req.body;

        if (!creatorId) {
            return res.status(400).json({ error: 'creatorId is required' });
        }
        if (!content?.trim() && (!mediaUrls || mediaUrls.length === 0)) {
            return res.status(400).json({ error: 'Post must have text content or at least one media file' });
        }

        // Verify the creator actually exists to prevent FK violation
        const creatorExists = await prisma.user.findUnique({
            where: { id: creatorId },
            select: { id: true, isCreator: true }
        });

        if (!creatorExists) {
            return res.status(404).json({ error: 'Creator not found. Please log in again.' });
        }

        const post = await prisma.post.create({
            data: {
                creatorId,
                content: content?.trim() || null,
                mediaUrls: mediaUrls || [],
                isPremium: isPremium || false,
                price: isPremium && price ? parseFloat(price) : null
            }
        });

        console.log(`[createPost] Post ${post.id} created by creator ${creatorId} with ${(mediaUrls || []).length} media file(s)`);
        res.status(201).json(post);
    } catch (error: any) {
        console.error('[createPost] Error:', error?.message || error);
        res.status(500).json({ error: 'Server error creating post' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // The requesting user's ID — sent as a header or query param by the client
        const requesterId = (req.headers['x-user-id'] as string) || (req.query.userId as string);

        // Fetch the post so we can check ownership and get media URLs
        const post = await prisma.post.findUnique({
            where: { id },
            select: { mediaUrls: true, creatorId: true }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // --- Ownership check ---
        // If a requesterId is provided, verify they own the post.
        // (Full JWT auth middleware can replace this in the future)
        if (requesterId && post.creatorId !== requesterId) {
            console.warn(`[deletePost] Unauthorized: user ${requesterId} tried to delete post ${id} owned by ${post.creatorId}`);
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        console.log(`[deletePost] Removing related records for post ${id}...`);
        // Manually cascade-delete related records
        await prisma.like.deleteMany({ where: { postId: id } });
        await prisma.comment.deleteMany({ where: { postId: id } });
        await prisma.purchase.deleteMany({ where: { postId: id } });

        console.log(`[deletePost] Deleting post ${id} from database...`);
        await prisma.post.delete({ where: { id } });

        // Clean up media files from S3/Cloudflare (non-blocking, best-effort)
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            console.log(`[deletePost] Scheduling S3 cleanup for ${post.mediaUrls.length} file(s)...`);
            deleteObjects(post.mediaUrls).catch((err: any) =>
                console.error(`[deletePost] S3/CF cleanup failed for post ${id}:`, err?.message || err)
            );
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        console.error(`[deletePost] Failed to delete post ${req.params.id}:`, error?.message || error);
        res.status(500).json({ error: 'Server error deleting post' });
    }
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const existingLike = await prisma.like.findFirst({
            where: { postId, userId }
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
        } else {
            await prisma.like.create({
                data: { postId, userId }
            });
        }

        const count = await prisma.like.count({ where: { postId } });
        return res.json({ count });
    } catch (error) {
        console.error('[toggleLike] Error:', error);
        res.status(500).json({ error: 'Server error toggling like' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, content } = req.body;

        if (!userId || !content?.trim()) {
            return res.status(400).json({ error: 'userId and content are required' });
        }

        const comment = await prisma.comment.create({
            data: { postId, userId, content: content.trim() },
            include: {
                user: { select: { username: true, avatarUrl: true } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('[addComment] Error:', error);
        res.status(500).json({ error: 'Server error adding comment' });
    }
};

export const getPostComments = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { username: true, avatarUrl: true } }
            }
        });

        res.json(comments);
    } catch (error) {
        console.error('[getPostComments] Error:', error);
        res.status(500).json({ error: 'Server error getting comments' });
    }
};

export const getUploadUrl = async (req: Request, res: Response) => {
    try {
        const { fileName, contentType } = req.query;
        if (!fileName || !contentType) {
            return res.status(400).json({ error: 'Missing fileName or contentType' });
        }

        const data = await generatePresignedUrl(fileName as string, contentType as string);
        res.json(data);
    } catch (error: any) {
        console.error('[getUploadUrl] Error generating presigned URL:', error?.message || error);
        res.status(500).json({ error: 'Server error generating upload URL' });
    }
};
