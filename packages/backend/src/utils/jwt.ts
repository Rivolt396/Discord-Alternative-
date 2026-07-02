import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
