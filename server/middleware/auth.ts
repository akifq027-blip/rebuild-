/**
 * BHARAT — Build the Civilization
 * JWT Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bharat_build_civilization_super_secret_jwt_key_2026';

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required. Please sign in.',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Session has expired or is invalid. Please sign in again.',
      },
    });
  }
}

export function generateToken(payload: AuthUser): string {
  return jwt.sign(
    { userId: payload.userId, email: payload.email, name: payload.name },
    JWT_SECRET,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    }
  );
}
