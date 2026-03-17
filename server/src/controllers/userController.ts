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
        const userId = req.body.id || req.body.userId || req.query.id || req.headers['x-user-id'] as string;

        if (!userId) {
            console.error('[DeleteUser] No userId found in body, query, or headers');
            return res.status(400).json({ error: 'User ID is required' });
        }

        console.log(`[DeleteUser] Attempting to delete user ${userId}...`);

        // 1. Fetch user with all relevant relations for cleanup
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { 
                posts: true,
                messagesSent: true,
                messagesRecv: true
            }
        });

        if (!user) {
            console.error(`[DeleteUser] User ${userId} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Collect ALL media URLs (Profile, Posts, Messages)
        const mediaUrls: string[] = [];
        if (user.avatarUrl) mediaUrls.push(user.avatarUrl);
        if (user.coverUrl) mediaUrls.push(user.coverUrl);
        
        user.posts.forEach(post => {
            if (post.mediaUrls && post.mediaUrls.length > 0) {
                mediaUrls.push(...post.mediaUrls);
            }
        });

        user.messagesSent.forEach(msg => {
            if (msg.mediaUrl) mediaUrls.push(msg.mediaUrl);
        });
        
        user.messagesRecv.forEach(msg => {
            if (msg.mediaUrl) mediaUrls.push(msg.mediaUrl);
        });

        // Collect all related IDs for the transaction
        const postIds = user.posts.map(p => p.id);
        const sentMessageIds = user.messagesSent.map(m => m.id);
        const recvMessageIds = user.messagesRecv.map(m => m.id);
        const allMessageIds = [...sentMessageIds, ...recvMessageIds];

        console.log(`[DeleteUser] Found ${mediaUrls.length} media URLs and ${postIds.length} posts for user ${userId}`);

        // 3. Delete from S3 (non-blocking, best effort)
        if (mediaUrls.length > 0) {
            console.log(`[DeleteUser] Cleaning up S3 for ${userId}...`);
            deleteObjects(mediaUrls).catch(s3Error => {
                console.error('[DeleteUser] S3 cleanup failed (non-critical):', s3Error);
            });
        }

        // 4. Delete from DB in a transaction
        // Order matters if no Cascade is set in DB FKs
        console.log(`[DeleteUser] Starting DB transaction for ${userId}...`);
        await prisma.$transaction([
            // 4a. Delete child records of the user's posts
            prisma.like.deleteMany({ where: { postId: { in: postIds } } }),
            prisma.comment.deleteMany({ where: { postId: { in: postIds } } }),
            prisma.purchase.deleteMany({ where: { postId: { in: postIds } } }),
            
            // 4b. Delete user's own child records (likes, comments, etc. on others' posts)
            prisma.like.deleteMany({ where: { userId } }),
            prisma.comment.deleteMany({ where: { userId } }),
            prisma.purchase.deleteMany({ where: { userId } }),
            
            // 4c. Delete purchases referencing user's messages (extremely thorough)
            prisma.purchase.deleteMany({ where: { messageId: { in: allMessageIds } } }),

            // 4d. Delete Messages, Tips, and Subscriptions (bidirectional)
            prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
            prisma.tip.deleteMany({ where: { OR: [{ tipperId: userId }, { creatorId: userId }] } }),
            prisma.subscription.deleteMany({ where: { OR: [{ subscriberId: userId }, { creatorId: userId }] } }),
            
            // 4e. Finally delete Posts and the User
            prisma.post.deleteMany({ where: { creatorId: userId } }),
            prisma.user.delete({ where: { id: userId } }),
        ]);

        console.log(`[DeleteUser] SUCCESS: Account ${userId} and all related data purged.`);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error: any) {
        console.error('[DeleteUser Final Error]', error?.message || error);
        res.status(500).json({ 
            error: 'Server error deleting account',
            details: error?.message || 'Transaction failed'
        });
    }
};
