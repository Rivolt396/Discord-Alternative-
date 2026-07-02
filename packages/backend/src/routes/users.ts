import express, { Router, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const router = Router();

// Mock user database (replace with MongoDB in production)
const users: any[] = [];

// Middleware to verify token
const authMiddleware = (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const decoded = verifyToken(token);
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/me', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { username } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) {
      user.username = username;
    }

    logger.info(`User updated: ${user.email}`);
    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
