# BHARAT — BUILD THE CIVILIZATION
### Educational Civilization-Building Game & History Simulation
**Smart India Hackathon (SIH26208) · AICTE Challenge Prototype**  
*"Challenge your creative mind to conceptualize and develop unique toys and games based on our civilization, history, and culture."*

---

## 1. Project Overview

**BHARAT — Build the Civilization** is not a passive quiz website or a trivia flashcard app. It is an **interactive, pedagogical civilization-building simulation** where players experience the living material history, urban architecture, science, and cultural milestones of the Indian subcontinent by building and nurturing an evolving settlement.

The gameplay progression takes the player on an educational journey across 11 broad historical chapters:
```
EXPLORE  →  COLLECT  →  LEARN  →  BUILD  →  DISCOVER  →  PROGRESS
```

### The 11 Educational Chapters
1. **Early Settlements** (c. 7000–2600 BCE): Domestication, hearths, mud-brick dwellings, microliths, Mehrgarh traditions.
2. **Indus / Harappan Civilization** (c. 2600–1900 BCE): Grid urban planning, baked-brick architecture, covered terracotta drainage, standard weights and seals.
3. **Vedic Period** (c. 1500–600 BCE): Pastoralism to settled farming, sacred hymns, iron introduction (*Krishna-Ayas*), assemblies (*Sabha* and *Samiti*).
4. **Mahajanapadas** (c. 600–320 BCE): Fortified cities, Northern Black Polished Ware, punch-marked coinage, philosophical debates (Upanishads, Buddhism, Jainism).
5. **Mauryan Period** (c. 320–185 BCE): Unified imperial administration, Chanakya's *Arthashastra*, grand stone pillars, Ashokan edicts, rock-cut caves.
6. **Gupta Period** (c. 320–550 CE): Classical astronomy (Aryabhata), mathematics (decimal place value, zero), metallurgy (Mehrauli Iron Pillar), Sanskrit drama.
7. **Medieval India** (c. 600–1200 CE): Monumental temple architecture (Chola bronze casting, Pallava shore temples, Chandela geometry), agrarian tank irrigation.
8. **Mughal Period** (c. 1526–1707 CE): Indo-Islamic synthesis, monumental gardens, Persian-Indian textile crafts, manuscript illumination.
9. **Regional Kingdoms and Cultural Centres** (c. 1300–1800 CE): Vijayanagara hydrology, Maratha hill-fort architecture, Ahom floodworks, Nayaka pillared halls.
10. **European Arrival & Maritime Trade** (c. 1500–1757 CE): Indian Ocean spice routes, coromandel calicoes, maritime trading factories.
11. **British Colonial Period & Freedom Era** (c. 1757–1947 CE): De-industrialization of artisanal handlooms, railway expansion, indigenous resistance, Swadeshi economic self-reliance.

---

## 2. PART 4 Architecture: Backend, Aiven MySQL & AI Acharya

In **PART 4**, the prototype transitions into a real full-stack cloud application:

```
                    BHARAT GAME
                         │
                         ▼
                   React Frontend (Vite + Tailwind CSS)
                         │  (REST API with JWT Bearer Token)
                         ▼
                  Express Backend (Node.js)
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Aiven MySQL             AI Acharya
    (mysql2 Connection Pool)   (Google Gemini API Server-Side)
              │                     │
              ▼                     ▼
        Player Progress       Educational Guide
```

### Key Part 4 Features
- **Express Backend**: RESTful API endpoints for authentication (`/api/auth/*`), player persistence (`/api/player/*`), health check (`/api/health`), and AI Acharya mentor (`/api/ai/*`).
- **Aiven Cloud MySQL Database**: Complete relational schema (`users`, `player_profiles`, `player_resources`, `player_buildings`, `player_technologies`, `player_missions`, `player_artifacts`, `player_discoveries`, `player_events`, `player_progress`, `achievements`).
- **Security & JWT Authentication**: Passwords hashed with `bcryptjs`, tamper-proof JWT tokens, parameterized SQL queries preventing SQL injection, zero API keys or database secrets exposed to client.
- **AI Acharya Mentor**: Floating `🤖 ACHARYA` guide powered securely on the server with `@google/genai` (`gemini-3.8-flash`). Strictly avoids hallucinations, distinguishes gameplay abstractions from historical facts, and includes offline curated historical insights.
- **Graceful Offline Fallback**: If Aiven MySQL or the network is temporarily offline, the game continues seamlessly in local browser storage, and syncs upon reconnection!

---

## 3. Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express 4, TypeScript / tsx
- **Database**: Aiven MySQL (or standard MySQL 8.0+) via `mysql2/promise` pool
- **Authentication**: JSON Web Tokens (JWT), `bcryptjs`
- **AI Mentor**: `@google/genai` TypeScript SDK (server-side)
- **Deployment**: Single full-stack process or separate Render web service (`process.env.PORT`)

---

## 4. Environment Variables Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Set the variables in `.env`:
```env
# Application Port
PORT=3000

# Client API Base URL (leave empty for same-origin dev preview)
VITE_API_URL=

# Aiven MySQL Cloud Database
DB_HOST=your-mysql-service-name.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=your_aiven_password
DB_NAME=bharat_db
DB_SSL=true

# JWT Authentication
JWT_SECRET=super_secret_jwt_key_sih2026
JWT_EXPIRES_IN=7d

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 5. Database Setup (Aiven MySQL)

1. Sign up on [Aiven Console](https://console.aiven.io/) and create a free/startup **MySQL** service.
2. Note your host, port, username, password, and database name.
3. Open `database/schema.sql` and run it in the Aiven Console Query Editor or via MySQL CLI:
   ```bash
   mysql -h your-service.aivencloud.com -P 3306 -u avnadmin -p defaultdb < database/schema.sql
   ```
4. For detailed step-by-step instructions, see [`AIVEN_SETUP.md`](./AIVEN_SETUP.md).

---

## 6. Running Locally

### Development Mode (Full-Stack on Port 3000)
```bash
# Install dependencies
npm install

# Run server with Express and Vite middleware
npm run dev
```
Open your browser to: `http://localhost:3000`

### Standalone Production Build
```bash
npm run build
npm start
```

---

## 7. API Verification & Testing

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```
Response:
```json
{
  "success": true,
  "server": "ok",
  "database": "connected",
  "ai": "ready",
  "version": "4.0.0-SIH26208"
}
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Aryabhata", "email": "aryabhata@bharat.edu", "password": "password123", "civilizationName": "Kusumapura"}'
```

### 3. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "aryabhata@bharat.edu", "password": "password123"}'
```

### 4. Consult Acharya
```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "Why was urban drainage important in the Harappan civilization?"}'
```

---

## 8. Part 4 Implementation Checklist

- [x] Express backend (`server.ts` with API routes)
- [x] MySQL connection pool (`mysql2/promise` with SSL)
- [x] Aiven cloud database compatibility
- [x] Database schema & seed data (`database/schema.sql`)
- [x] User registration with input validation
- [x] User login with password verification
- [x] JWT-based stateless authentication & `requireAuth` middleware
- [x] Secure password hashing using `bcryptjs`
- [x] Player profile persistence
- [x] Resource persistence (`food`, `water`, `wood`, `stone`, `metal`, `knowledge`, `culture`, `trade`)
- [x] Building counts & slot persistence
- [x] Technology unlock persistence
- [x] Mission progress & completion persistence
- [x] Museum artifact persistence
- [x] Progress & journal history persistence
- [x] Frontend centralized API service (`src/services/api.ts`)
- [x] Debounced cloud auto-save & manual sync
- [x] Local storage offline fallback
- [x] Floating `🤖 ACHARYA` button & chat drawer
- [x] Server-side AI Acharya API with context awareness
- [x] Strict safety rules distinguishing history from gameplay
- [x] Safe AI API key handling on server only
- [x] Comprehensive error handling & loading states
- [x] Environment configuration template (`.env.example`)
- [x] Render cloud deployment compatibility (`process.env.PORT`)
- [x] Aiven setup guide (`AIVEN_SETUP.md`)
