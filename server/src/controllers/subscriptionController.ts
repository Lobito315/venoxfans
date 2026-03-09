import { Request, Response } from 'express';
import { prisma } from '../index';

export const subscribe = async (req: Request, res: Response) => {
    try {
        const { subscriberId, creatorId, amount } = req.body;

        // Create subscription 
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        const subscription = await prisma.subscription.create({
            data: {
                subscriberId,
                creatorId,
                status: 'ACTIVE',
                amount,
                expiresAt
            }
        });

        res.status(201).json(subscription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getSubscriptions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const subscriptions = await prisma.subscription.findMany({
            where: { subscriberId: userId },
            include: {
                creator: {
                    select: { id: true, username: true, avatarUrl: true }
                }
            }
        });

        res.json(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
