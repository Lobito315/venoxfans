import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password, role, dateOfBirth } = req.body;

        // Check role and age requirements
        if (role === 'creator') {
            if (!dateOfBirth) {
                return res.status(400).json({ error: 'Date of birth is required for creators' });
            }

            const dob = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 18) {
                return res.status(400).json({ error: 'You must be at least 18 years old to be a creator' });
            }
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
                isCreator: role === 'creator',
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, isCreator: user.isCreator }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ user: { id: user.id, username: user.username, email: user.email, isCreator: user.isCreator }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
