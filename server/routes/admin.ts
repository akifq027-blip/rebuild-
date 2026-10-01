/**
 * BHARAT — Build the Civilization
 * Admin Dashboard & Content Management Route (Part 5)
 */

import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { requireAuth } from '../middleware/auth';

const router = Router();

// In-memory announcements store
let announcements = [
  {
    id: 'ann_welcome',
    title: 'Smart India Hackathon SIH26208 Demo Active',
    message: 'Welcome to the BHARAT Civilization simulation prototype. Explore all 11 historical chapters and consult Acharya.',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: 'info',
  },
];

/**
 * GET /api/admin/stats
 * Aggregated analytics for jury & administrative review
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    if (pool) {
      const [[userCount]]: any = await pool.query('SELECT COUNT(*) as count FROM users');
      const [[civCount]]: any = await pool.query('SELECT COUNT(*) as count FROM player_profiles');
      const [[artifactCount]]: any = await pool.query('SELECT COUNT(*) as count FROM player_artifacts');
      const [[techCount]]: any = await pool.query('SELECT COUNT(*) as count FROM player_technologies');
      const [[missionCount]]: any = await pool.query('SELECT COUNT(*) as count FROM player_missions WHERE completed = true');

      return res.json({
        success: true,
        data: {
          totalUsers: userCount.count || 0,
          activeCivilizations: civCount.count || 0,
          artifactsDiscovered: artifactCount.count || 0,
          technologiesUnlocked: techCount.count || 0,
          missionsCompleted: missionCount.count || 0,
          databaseStatus: 'Aiven MySQL Online',
        },
      });
    } else {
      // In-Memory Fallback Stats
      return res.json({
        success: true,
        data: {
          totalUsers: 1,
          activeCivilizations: 1,
          artifactsDiscovered: 4,
          technologiesUnlocked: 6,
          missionsCompleted: 5,
          databaseStatus: 'Local Memory Store (Aiven Unconfigured)',
        },
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'STATS_ERROR', message: 'Failed to retrieve administrative statistics.' },
    });
  }
});

/**
 * GET /api/admin/announcements
 */
router.get('/announcements', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: announcements,
  });
});

/**
 * POST /api/admin/announcements
 */
router.post('/announcements', (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_FIELDS', message: 'Title and message are required.' },
    });
  }

  const newAnn = {
    id: `ann_${Date.now()}`,
    title: String(title).trim(),
    message: String(message).trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: type || 'info',
  };

  announcements.unshift(newAnn);

  return res.status(201).json({
    success: true,
    data: newAnn,
  });
});

/**
 * DELETE /api/admin/announcements/:id
 */
router.delete('/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  announcements = announcements.filter((a) => a.id !== id);

  return res.json({
    success: true,
    data: { message: 'Announcement deleted.' },
  });
});

export default router;
