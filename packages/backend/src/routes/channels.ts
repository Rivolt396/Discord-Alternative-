import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const router = Router();

// Mock channels database (replace with MongoDB in production)
const channels: any[] = [];
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

// Create channel
router.post('/:serverId/channels', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId } = req.params;
    const { name, type } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.ownerId !== userId) {
      return res.status(403).json({ error: 'Only owner can create channels' });
    }

    const channelId = uuidv4();
    const newChannel = {
      id: channelId,
      serverId,
      name,
      type: type || 'text',
      createdAt: new Date(),
      messages: [],
    };

    channels.push(newChannel);
    server.channels.push(channelId);

    logger.info(`Channel created: ${name} in server ${serverId}`);
    res.status(201).json({
      message: 'Channel created successfully',
      channel: newChannel,
    });
  } catch (error) {
    logger.error('Create channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all channels for server
router.get('/:serverId/channels', authMiddleware, (req: Request, res: Response) => {
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

    const serverChannels = channels.filter(c => c.serverId === serverId);

    res.json({
      channels: serverChannels,
    });
  } catch (error) {
    logger.error('Get channels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get channel by ID
router.get('/:serverId/channels/:channelId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId, channelId } = req.params;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (!server.members.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const channel = channels.find(c => c.id === channelId && c.serverId === serverId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    logger.error('Get channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update channel
router.put('/:serverId/channels/:channelId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId, channelId } = req.params;
    const { name } = req.body;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.ownerId !== userId) {
      return res.status(403).json({ error: 'Only owner can update channels' });
    }

    const channel = channels.find(c => c.id === channelId && c.serverId === serverId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (name) channel.name = name;

    logger.info(`Channel updated: ${channelId}`);
    res.json({
      message: 'Channel updated successfully',
      channel,
    });
  } catch (error) {
    logger.error('Update channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete channel
router.delete('/:serverId/channels/:channelId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { serverId, channelId } = req.params;

    const server = servers.find(s => s.id === serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.ownerId !== userId) {
      return res.status(403).json({ error: 'Only owner can delete channels' });
    }

    const channelIndex = channels.findIndex(c => c.id === channelId && c.serverId === serverId);
    if (channelIndex === -1) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    channels.splice(channelIndex, 1);
    server.channels = server.channels.filter(cId => cId !== channelId);

    logger.info(`Channel deleted: ${channelId}`);
    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    logger.error('Delete channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
