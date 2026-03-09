import { Request, Response } from 'express';
import { prisma } from '../index';

export const getFeed = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: { id: true, username: true, avatarUrl: true }
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { creatorId, content, mediaUrls, isPremium, price } = req.body; // In real app, creatorId comes from auth token

        const post = await prisma.post.create({
            data: {
                creatorId,
                content,
                mediaUrls: mediaUrls || [],
                isPremium: isPremium || false,
                price: price || null
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({ where: { id } });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting post' });
    }
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body; // In real app, from auth middleware

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
        console.error(error);
        res.status(500).json({ error: 'Server error toggling like' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;
        const { userId, content } = req.body;

        const comment = await prisma.comment.create({
            data: { postId, userId, content },
            include: {
                user: { select: { username: true, avatarUrl: true } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: 'Server error getting comments' });
    }
};
