# AGENTS.md — BHARAT: Build the Civilization

## Project Overview
BHARAT: Build the Civilization is a polished browser-based civilization strategy game set across ancient Indian history. The core gameplay loop follows:
**BUILD → COLLECT → UPGRADE → RESEARCH → TRAIN → BATTLE → DISCOVER → EXPAND**

The game is built with a clean full-stack architecture:
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide icons, Canvas 2.5D/Isometric strategy renderer.
- **Backend**: Node.js, Express (mounted in `server.ts`).
- **Database**: MySQL (compatible with Aiven MySQL Cloud).
- **Authentication**: JWT token-based auth with bcrypt password hashing.

## Directory Structure
- `/src/types/`: Strict TypeScript interfaces for civilization, resources, buildings, army, research, missions, map, and battle.
- `/src/game/`: Core game simulation logic:
  - `state.ts`: Master game state reducer and store.
  - `resources.ts`: Centralized 5-resource economy (Food, Wood, Stone, Clay, Knowledge) with production, caps, and consumption.
  - `buildings.ts`: Building catalog, tier stats, costs, footprints, and historical notes.
  - `construction.ts`: Building placement grid, construction queues, and level upgrades.
  - `research.ts`: Non-linear ancient Indian technology tree.
  - `army.ts`: Troop types, training grounds, and martial formations.
  - `missions.ts`: 8-step guided onboarding and progression milestones.
  - `map.ts`: Regional exploration expedition sites across the subcontinent.
  - `discoveries.ts`: Archaeological and historical discovery catalog.
- `/src/components/`:
  - `/world/`: Living interactive civilization map (canvas/grid landscape, animated water, roads, resource patches, buildings with level visuals).
  - `/hud/`: Top resource bar, civilization progress header, notification toasts.
  - `/navigation/`: Desktop header dock and mobile bottom navigation (HOME, BUILD, ARMY, MAP, RESEARCH).
  - `/panels/`: Contextual Building Panel, Build Catalog Modal, Army Training Sheet, Tech Tree Modal, Regional Expedition Map, Missions Drawer.
  - `/onboarding/`: Interactive step-by-step visual guide (Steps 1–8).
  - `/auth/`: User registration, login, and Aiven cloud persistence status.
- `/server/`: Express API routes for auth, player state persistence (`/api/game/state`), and AI Acharya historical consultation.

## Core Rules for Contributors & Agents
1. **No Fake Buttons**: Every button must perform a real game action or open a functional interface.
2. **True Responsive Design**: Mobile devices must have dedicated bottom-navigation, touch-friendly tap targets (>= 44px), compact resource bars, and bottom sheets. Desktop gets expansive side panels and hotkeys.
3. **Authentic Strategy Feel**: High-quality visual polish with ancient Indian motifs (sandstone, bronze, terracotta, deep indigo, forest green, warm parchment).
4. **Performance First**: Maintain smooth 60fps on mobile browsers using optimized vector/canvas rendering and decoupled animation timers.
