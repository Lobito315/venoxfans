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
