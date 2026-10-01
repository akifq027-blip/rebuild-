/**
 * BHARAT — Build the Civilization
 * Aiven MySQL Database Connection Configuration (mysql2/promise)
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export interface DbStatus {
  connected: boolean;
  message: string;
  error?: string;
}

let pool: mysql.Pool | null = null;
let isConfigured = false;

const dbHost = process.env.DB_HOST?.trim();
const dbUser = process.env.DB_USER?.trim();
const dbPassword = process.env.DB_PASSWORD?.trim();
const dbName = process.env.DB_NAME?.trim() || 'bharat_db';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

if (dbHost && dbUser) {
  try {
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: dbSsl ? { rejectUnauthorized: false } : undefined,
    });
    isConfigured = true;
  } catch (err: any) {
    console.warn('[Database] Failed to initialize MySQL pool:', err.message);
  }
} else {
  console.info('[Database] No MySQL host provided in environment. Running in offline/fallback mode.');
}

/**
 * Test database connectivity
 */
export async function testDbConnection(): Promise<DbStatus> {
  if (!pool || !isConfigured) {
    return {
      connected: false,
      message: 'Database not configured in .env (DB_HOST missing). Offline local mode active.',
    };
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return {
      connected: true,
      message: 'Successfully connected to Aiven MySQL database.',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: 'Failed to connect to MySQL database.',
      error: err.message,
    };
  }
}

/**
 * Export connection pool
 */
export { pool };
export default pool;
