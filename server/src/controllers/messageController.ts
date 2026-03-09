import { Request, Response } from 'express';
import { prisma } from '../index';

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, content, mediaUrl, isPaid, price } = req.body;

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
                mediaUrl,
                isPaid: isPaid || false,
                price: price || null
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getConversation = async (req: Request, res: Response) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
