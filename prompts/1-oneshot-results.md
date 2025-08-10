# 5BulletMethod One-Shot Results

## Original Request
Build an MVP for 5BulletMethod, a weekly productivity journaling app where users log up to 5 bullet-point accomplishments per week, view history, see a streak, and get a simple motivational insight. Use:
- Frontend: React + Vite (TypeScript) + Tailwind CSS
- Backend: Azure Functions (Node.js + TypeScript)
- Database: SQLite (better-sqlite3)
- Auth: Simulated (userId = "test-user")
- Must run locally; seed data; include .env.example and README

Reference prompt: `.github/prompts/5BulletMethod-OneShot-Demo.prompt.md`.

## Actions Taken
- Scaffolded monorepo structure: `/api`, `/web`, `/db`.
- DB: Added schema (`db/schema.sql`), init (`db/init.js`), and seed script (`db/seed.js`).
- API (TypeScript): Implemented endpoints using better-sqlite3.
  - `GET /entries`, `POST /entries`, `GET/PUT/DELETE /entries/:id`
  - `GET /streak`
  - `GET /entries/:id/insight` (stub)
- Functions runtime: Created TypeScript functions with `@azure/functions` app.http handlers.
  - Noted local Functions host error (IServiceProvider disposed). Added fallback for dev.
- Local fallback API: Added Express server (`api/src/server.ts`) that mirrors the Functions endpoints for smooth local dev.
- Web app: Vite + React + Tailwind scaffold with pages and components to submit entries, view history and streak, and show insight.
- Root scripts: install, db init/seed, and dev orchestrations.
- Environment examples and READMEs added.

## Results
- Database initializes and seeds successfully.
- Web dev server runs (Vite) and renders UI.
- Local API (Express) runs and serves all required endpoints.
- End-to-end flow works locally: create weekly entry (1–5 items), see history and streak, and receive stubbed insight.
- Azure Functions Core Tools on this machine currently fails with: "Cannot access a disposed object. IServiceProvider." The Express server unblocks development while that’s investigated.

### How to Run (PowerShell)
1) Copy env examples
```
Copy-Item .env.example .env -ErrorAction SilentlyContinue
Copy-Item web/.env.example web/.env -ErrorAction SilentlyContinue
```
2) Install deps
```
npm run install:all
```
3) Initialize and seed DB
```
npm run db:init
npm run db:seed
```
4) Start dev (Express API + Vite)
```
npm run dev:local
```
- Web: shown in terminal (e.g., http://localhost:5174/)
- API: http://localhost:7072/api

### Notes
- API fallback uses Express during development. Once the Functions host error is resolved (check Azure Functions Core Tools v4, Node.js LTS, .NET runtime), you can switch to:
```
npm run dev
```
- Seeded user is `test-user`. Weeks are ISO Mondays (YYYY-MM-DD UTC).
- Insight is stubbed to: "You're staying balanced across life areas!"
