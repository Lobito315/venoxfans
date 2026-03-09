import { Request, Response } from 'express';
import { prisma } from '../index';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                coverUrl: true,
                bio: true,
                isCreator: true,
                subscriptionPrice: true,
                createdAt: true,
                // Don't include email or passwordHash
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTrendingCreators = async (req: Request, res: Response) => {
    try {
        const creators = await prisma.user.findMany({
            where: { isCreator: true },
            take: 10,
            orderBy: {
                subscribers: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                bio: true,
                subscriptionPrice: true,
                _count: {
                    select: { subscribers: true }
                }
            }
        });

        res.json(creators);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { username, avatarUrl, bio, subscriptionPrice, coverUrl } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required to update profile' });
        }

        const user = await prisma.user.update({
            where: { username },
            data: {
                ...(avatarUrl !== undefined && { avatarUrl }),
                ...(bio !== undefined && { bio }),
                ...(subscriptionPrice !== undefined && { subscriptionPrice }),
                ...(coverUrl !== undefined && { coverUrl }),
            },
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                coverUrl: true,
                bio: true,
                isCreator: true,
                subscriptionPrice: true,
                email: true,
            }
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
};
