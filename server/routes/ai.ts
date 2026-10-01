/**
 * BHARAT — Build the Civilization
 * AI Acharya Historical Guide Route
 */

import { Router, Request, Response } from 'express';
import { askAcharya, AcharyaContext } from '../services/aiService';

const router = Router();

/**
 * POST /api/ai/ask
 */
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body as { message: string; context?: AcharyaContext };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_PROMPT', message: 'Please provide a question for Acharya.' },
      });
    }

    const answer = await askAcharya(message.trim(), context);

    return res.json({
      success: true,
      data: {
        answer,
        guide: 'Acharya',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[AI Route Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'AI_UNAVAILABLE',
        message: 'Acharya is temporarily contemplating historical records. Please try asking again in a moment.',
      },
    });
  }
});

export default router;
