# 5BulletMethod (MVP)

A local-only MVP of a weekly productivity journaling app. Users add up to 5 bullet accomplishments per week, view history, see a streak, and receive a simple motivational insight.

## Tech Stack
- Frontend: React + Vite (TypeScript) + Tailwind CSS
- Backend: Azure Functions (Node.js + TypeScript)
- Database: SQLite via better-sqlite3
- Auth: Simulated (userId = `test-user`)

## Monorepo Structure
```
/api  – Azure Functions (TypeScript)
/web  – React + Vite + Tailwind
/db   – SQLite schema and seed scripts
```

## Prerequisites
- Node.js 18+
- Azure Functions Core Tools v4

## Setup
1. Copy env example
```pwsh
Copy-Item .env.example .env
```
2. Install dependencies
```pwsh
npm run install:all
```
3. Initialize and seed DB
```pwsh
npm run db:init
npm run db:seed
```
4. Start dev servers (Functions + Vite)
```pwsh
npm run dev
```
- Web at http://localhost:$env:WEB_PORT (default 5173)
- API at http://localhost:$env:API_PORT (default 7071)

## API Overview
- POST /entries  – Create weekly entry (max 5 items). If already exists for week, returns 409 with existing id.
- GET /entries   – List entries (most recent first)
- GET /entries/:id – Get one entry
- PUT /entries/:id – Replace items (max 5)
- DELETE /entries/:id – Delete entry
- GET /streak – Return `{ streak: number }`
- GET /entries/:id/insight – Returns `{ insight: string }`

All requests implicitly target user `test-user`.

## Notes
- Week starts on Monday (ISO). Stored as YYYY-MM-DD (UTC).
- Insight is stubbed: "You're staying balanced across life areas!"

## Troubleshooting
- If Functions host fails, ensure Azure Functions Core Tools v4 is installed and PATH configured.
- Delete `/db/5bulletmethod.db` to reset and re-run init/seed.
- CORS for web dev is allowed via `local.settings.json` (copy example to `api/local.settings.json` if needed).
