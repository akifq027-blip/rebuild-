/**
 * BHARAT — Build the Civilization
 * Health Check API Route
 */

import { Router, Request, Response } from 'express';
import { testDbConnection } from '../config/database';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const dbStatus = await testDbConnection();
  const hasAiKey = Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);

  res.json({
    success: true,
    server: 'ok',
    database: dbStatus.connected ? 'connected' : 'unconfigured',
    databaseDetails: dbStatus.message,
    ai: hasAiKey ? 'ready' : 'curated_fallback',
    version: '4.0.0-SIH26208',
    timestamp: new Date().toISOString(),
  });
});

export default router;
