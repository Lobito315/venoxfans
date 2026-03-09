import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import messageRoutes from './routes/messageRoutes';

// Routes will be added here
app.use('/api/auth', authRoutes);
app.use('/api/creators', userRoutes); // For trending creators
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
