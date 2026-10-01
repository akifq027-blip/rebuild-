/**
 * BHARAT — Build the Civilization
 * Player Game State API Routes
 */

import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPlayerState, savePlayerState, SaveStatePayload } from '../services/playerService';

const router = Router();

/**
 * GET /api/player/state
 * Returns complete player game state
 */
router.get('/state', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const state = await getPlayerState(userId);

    return res.json({
      success: true,
      data: state,
    });
  } catch (err: any) {
    console.error('[Get Player State Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'STATE_FETCH_FAILED', message: 'Unable to retrieve player game state.' },
    });
  }
});

/**
 * POST /api/player/state
 * Persists updated game state to MySQL
 */
router.post('/state', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const payload = req.body as SaveStatePayload;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAYLOAD', message: 'State payload is missing or invalid.' },
      });
    }

    const result = await savePlayerState(userId, payload);

    return res.json({
      success: true,
      data: {
        message: 'Civilization progress safely preserved.',
        savedTo: result.savedTo,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Save Player State Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'STATE_SAVE_FAILED', message: 'Unable to save civilization state.' },
    });
  }
});

/**
 * POST /api/player/sync
 * Syncs local progress to server on login/migration
 */
router.post('/sync', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const localPayload = req.body as SaveStatePayload;

    if (localPayload && typeof localPayload === 'object') {
      await savePlayerState(userId, localPayload);
    }

    const currentState = await getPlayerState(userId);

    return res.json({
      success: true,
      data: {
        message: 'Local civilization synchronized with cloud database.',
        state: currentState,
      },
    });
  } catch (err: any) {
    console.error('[Sync Player State Error]:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SYNC_FAILED', message: 'Synchronization could not be completed.' },
    });
  }
});

export default router;
