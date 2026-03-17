import { Request, Response } from 'express';
import { prisma } from '../index';
import { deleteObjects } from '../services/s3Service';

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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.body; // Expecting userId from auth or body

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // 1. Fetch user and all their posts to get media URLs
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { posts: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Collect all media URLs for S3 cleanup
        const mediaUrls: string[] = [];
        if (user.avatarUrl) mediaUrls.push(user.avatarUrl);
        if (user.coverUrl) mediaUrls.push(user.coverUrl);
        
        user.posts.forEach(post => {
            if (post.mediaUrls && post.mediaUrls.length > 0) {
                mediaUrls.push(...post.mediaUrls);
            }
        });

        // 3. Delete from S3 if there are any URLs
        if (mediaUrls.length > 0) {
            try {
                await deleteObjects(mediaUrls);
            } catch (s3Error) {
                console.error('[DeleteUser] S3 cleanup failed, continuing with DB deletion:', s3Error);
            }
        }

        // 4. Delete from DB in a transaction
        // Note: We need to handle related entities if Prisma doesn't have Cascade deletes set for all
        await prisma.$transaction([
            prisma.like.deleteMany({ where: { userId } }),
            prisma.comment.deleteMany({ where: { userId } }),
            prisma.purchase.deleteMany({ where: { userId } }),
            prisma.subscription.deleteMany({ where: { OR: [{ subscriberId: userId }, { creatorId: userId }] } }),
            prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
            prisma.tip.deleteMany({ where: { OR: [{ tipperId: userId }, { creatorId: userId }] } }),
            prisma.post.deleteMany({ where: { creatorId: userId } }),
            prisma.user.delete({ where: { id: userId } }),
        ]);

        console.log(`[DeleteUser] Account ${userId} and all related data deleted.`);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('[DeleteUser Error]', error);
        res.status(500).json({ error: 'Server error deleting account' });
    }
};
