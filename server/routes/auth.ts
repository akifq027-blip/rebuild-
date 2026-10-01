/**
 * BHARAT — Build the Civilization
 * Authentication Routes (Register, Login, Me)
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { requireAuth, generateToken } from '../middleware/auth';
import { initializePlayerData, getPlayerState } from '../services/playerService';

const router = Router();

// In-memory fallback user store when MySQL is unconfigured
const inMemoryUsers: Array<{
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  civilizationName: string;
}> = [];

let memoryUserIdCounter = 1;

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, civilizationName } = req.body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_NAME', message: 'Name must be at least 2 characters long.' },
      });
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters.' },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanCivName = civilizationName?.trim() || 'My Bharat';

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. MySQL Storage or In-memory Fallback
    if (pool) {
      // Check existing user
      const [existing]: any = await pool.query(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' },
        });
      }

      // Insert new user
      const [result]: any = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [cleanName, cleanEmail, passwordHash]
      );

      const userId = result.insertId;

      // Initialize player civilization defaults
      await initializePlayerData(userId, cleanCivName);

      const token = generateToken({ userId, email: cleanEmail, name: cleanName });

      return res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: userId,
            name: cleanName,
            email: cleanEmail,
          },
          civilizationName: cleanCivName,
        },
      });
    } else {
      // In-Memory Fallback
      const existing = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' },
        });
      }

      const userId = memoryUserIdCounter++;
      inMemoryUsers.push({
        id: userId,
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        civilizationName: cleanCivName,
      });

      await initializePlayerData(userId, cleanCivName);

      const token = generateToken({ userId, email: cleanEmail, name: cleanName });

      return res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: userId,
            name: cleanName,
            email: cleanEmail,
          },
          civilizationName: cleanCivName,
          mode: 'offline_local_storage',
        },
      });
    }
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create user account. Please try again.' },
    });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required.' },
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (pool) {
      const [rows]: any = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );

      const user = rows[0];
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        });
      }

      const token = generateToken({ userId: user.id, email: user.email, name: user.name });
      const playerState = await getPlayerState(user.id);

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          playerState,
        },
      });
    } else {
      // In-Memory Fallback
      const user = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        });
      }

      const token = generateToken({ userId: user.id, email: user.email, name: user.name });
      const playerState = await getPlayerState(user.id);

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          playerState,
          mode: 'offline_local_storage',
        },
      });
    }
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Sign in failed. Please check your connection.' },
    });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const playerState = await getPlayerState(userId);

    return res.json({
      success: true,
      data: {
        user: req.user,
        playerState,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch user profile.' },
    });
  }
});

export default router;
