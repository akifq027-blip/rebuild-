# BHARAT — BUILD THE CIVILIZATION
## Database Architecture & Aiven MySQL Schema

### 1. Database Engine
- **Engine**: MySQL 8.0+ / Aiven Cloud MySQL
- **Connection Driver**: `mysql2/promise` with SSL enabled (`ssl: { rejectUnauthorized: false }`)
- **Connection Pooling**: 10 pooled connections with query queuing

### 2. Table Schemas (`database/schema.sql`)
1. **`users`**: User login accounts, bcrypt password hashes, timestamps.
2. **`player_profiles`**: Civilization name, level, XP, population, storage limit.
3. **`player_resources`**: Food, water, wood, stone, metal, knowledge, culture, trade.
4. **`player_buildings`**: Building counts, status, and layout mappings.
5. **`player_technologies`**: Unlocked technologies per player.
6. **`player_missions`**: Progress, completion, and reward claim status.
7. **`player_artifacts`**: Discovered relics and the historical era of unearthing.
8. **`player_discoveries`**: Ecological and geographical discoveries.
9. **`player_events`**: Historical choices made during dilemmas.
10. **`player_progress`**: Era progression state, building slots JSON, and journal entries.
11. **`achievements`**: Pre-seeded milestone achievements.
12. **`player_achievements`**: Records of player-unlocked milestones.

### 3. Fail-Safe Offline Mode
When environment variables (`DB_HOST`) are not provided, the server switches to an in-memory repository, and the client uses browser `localStorage`. When the database connection is restored, synchronization occurs seamlessly via `/api/player/sync`.
