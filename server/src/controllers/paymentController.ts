import { Request, Response } from 'express';
import { prisma } from '../index';
import { createPayPalOrder, capturePayPalOrder } from '../services/paypalService';

/**
 * Creates a PayPal order for a subscription or PPV purchase.
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { type, targetId, amount } = req.body;

        if (!type || !targetId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const order = await createPayPalOrder(amount.toString());
        res.json(order);
    } catch (error: any) {
        console.error('[createOrder] Error:', error?.message || error);
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
};

/**
 * Captures a PayPal order and updates the database.
 */
export const captureOrder = async (req: Request, res: Response) => {
    try {
        const { orderID, type, subscriberId, creatorId, postId, amount } = req.body;

        if (!orderID || !type) {
            return res.status(400).json({ error: 'Missing orderID or type' });
        }

        const capture = await capturePayPalOrder(orderID);

        if (capture.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Payment not completed', details: capture });
        }

        // Update database based on type
        if (type === 'SUBSCRIPTION') {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            await prisma.subscription.create({
                data: {
                    subscriberId,
                    creatorId,
                    status: 'ACTIVE',
                    amount: parseFloat(amount),
                    expiresAt
                }
            });
        } else if (type === 'PURCHASE') {
            await prisma.purchase.create({
                data: {
                    userId: subscriberId,
                    postId,
                    amount: parseFloat(amount)
                }
            });
        }

        res.json({ success: true, capture });
    } catch (error: any) {
        console.error('[captureOrder] Error:', error?.message || error);
        res.status(500).json({ error: 'Failed to capture PayPal order' });
    }
};
