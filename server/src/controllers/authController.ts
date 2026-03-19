import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');


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

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        let payload;
        try {
            // Try as ID Token first (standard JWT)
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id'
            });
            payload = ticket.getPayload();
        } catch (error) {
            // If verification fails, it might be an access token (common with custom button implementations)
            // Fetch user info directly from Google using the access token
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                payload = await response.json();
            } else {
                console.error('Google token verification failed (both ID and Access):', error);
                return res.status(400).json({ error: 'Invalid Google token' });
            }
        }
        
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token payload' });
        }
        
        const { sub: googleId, email, name, picture } = (payload as any);
        
        // Find or create user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email }
                ]
            }
        });
        
        if (!user) {
            // Create a new user from Google profile
            // Format a default username from email or name
            const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') ||
                name?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 
                `user${Math.floor(Math.random() * 10000)}`;
                
            let username = baseUsername;
            let counter = 1;
            
            // Ensure unique username
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    googleId,
                    avatarUrl: picture,
                    isCreator: false // Default to regular user
                }
            });
        } else if (!user.googleId) {
            // Update existing user with Google ID
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId, avatarUrl: user.avatarUrl || picture }
            });
        }
        
        const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                isCreator: user.isCreator 
            }, 
            token: jwtToken 
        });
        
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: 'Google login failed' });
    }
};

