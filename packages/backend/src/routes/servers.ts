import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const router = Router();

// Mock servers database (replace with MongoDB in production)
const servers: any[] = [];

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

// Create server
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Server name is required' });
    }

    const serverId = uuidv4();
    const newServer = {
      id: serverId,
      name,
      description: description || '',
      ownerId: userId,
      members: [userId],
      channels: [],
      createdAt: new Date(),
    };

    servers.push(newServer);

    logger.info(`Server created: ${name} by user ${userId}`);
    res.status(201).json({
      message: 'Server created successfully',
      server: newServer,
    });
  } catch (error) {
    logger.error('Create server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all servers for user
router.get('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userServers = servers.filter(s => s.members.includes(userId));

    res.json({
      servers: userServers,
    });
  } catch (error) {
    logger.error('Get servers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get server by ID
router.get('/:serverId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId } = req.params;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (!server.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(server);
  } catch (error) {
    logger.error('Get server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update server
router.put('/:serverId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId } = req.params;
    const { name, description } = req.body;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.ownerId !== userId) {
      return res.status(403).json({ error: 'Only owner can update server' });
    }

    if (name) server.name = name;
    if (description !== undefined) server.description = description;

    logger.info(`Server updated: ${serverId}`);
    res.json({
      message: 'Server updated successfully',
      server,
    });
  } catch (error) {
    logger.error('Update server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete server
router.delete('/:serverId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId } = req.params;

    const serverIndex = servers.findIndex(s => s.id === serverId);
    if (serverIndex === -1) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const server = servers[serverIndex];
    if (server.ownerId !== userId) {
      return res.status(403).json({ error: 'Only owner can delete server' });
    }

    servers.splice(serverIndex, 1);

    logger.info(`Server deleted: ${serverId}`);
    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    logger.error('Delete server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join server
router.post('/:serverId/join', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId } = req.params;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    server.members.push(userId);

    logger.info(`User ${userId} joined server ${serverId}`);
    res.json({ message: 'Joined server successfully', server });
  } catch (error) {
    logger.error('Join server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
