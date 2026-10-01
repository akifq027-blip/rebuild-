# BHARAT — BUILD THE CIVILIZATION
## Architecture & Technical Design

### 1. High-Level Architecture
BHARAT is structured as a full-stack, decoupled educational simulation:

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT 19 FRONTEND                        │
│  - Vite build pipeline + Tailwind CSS                       │
│  - Modular Components (Map, Tech Tree, Timeline, Museum)    │
│  - AuthContext + Centralized API Client (src/services/api)  │
│  - Offline Fallback Engine (LocalStorage mirror)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS BACKEND                        │
│  - Node.js runtime (tsx server.ts)                          │
│  - JWT Authentication Middleware (requireAuth)              │
│  - State Validation & Rate-Safe Endpoints                   │
│  - Vite Dev Middleware in Development                       │
└──────────────┬──────────────────────────────┬───────────────┘
               │ mysql2/promise               │ @google/genai
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      AIVEN CLOUD MYSQL       │ │         AI ACHARYA         │
│  - 12 Relational Tables      │ │  - Google Gemini API       │
│  - SSL Encrypted Pool        │ │  - Historical System Prompt│
│  - Foreign Key Cascades      │ │  - Offline Curated Backup  │
└──────────────────────────────┘ └────────────────────────────┘
```

### 2. Frontend Layer (`src/`)
- **State Flow**: Single authoritative `GameState` held in React state with optimistic UI updates.
- **Debounced Cloud Sync**: Changes auto-sync to the server after 2.5 seconds of inactivity.
- **Fail-Safe Offline Mode**: If disconnected, the game operates seamlessly in local storage without crashing.

### 3. Backend Layer (`server/`)
- `server.ts`: Entry point listening on `process.env.PORT || 3000`.
- `server/routes/auth.ts`: Registration, login, and user profile with `bcryptjs` password encryption.
- `server/routes/player.ts`: State retrieval, state updates with validation, and migration synchronization.
- `server/routes/ai.ts`: Acharya chat proxy isolating API credentials.
- `server/routes/admin.ts`: System telemetry, analytics, and announcements.
- `server/services/aiService.ts`: System instructions, safety rules, and fallback responses.
