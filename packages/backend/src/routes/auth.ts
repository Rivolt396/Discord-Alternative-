import express, { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const router = Router();

// Mock user database (replace with MongoDB in production)
const users: any[] = [];

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const userId = uuidv4();
    const newUser = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    const token = generateToken(userId);

    logger.info(`User registered: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    logger.info(`User logged in: ${email}`);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
