# 5BulletMethod (MVP)

A local-only MVP of a weekly productivity journaling app. Users add up to 5 bullet accomplishments per week, view history, see a streak, and receive a simple motivational insight.

## This repo is a learning source
I'm using this repo to learn about vibe codoing a full-stack app with React, Azure Functions, and SQLite. It is not currently ready to be production-ready and may never be.

Currently, there are several branches for development of the app using different models. 

- gpt-5
- gpt-4.1
- sonnet-4
- gemini-2.5-pro

Each branch holds an app built using the same one-shot demo prompt as the [5BulletMethod OneShot Demo](.github\prompts\5BulletMethod-OneShot-Demo.prompt.md).

### Content of the master branch

The only things in the master branch are these README instructions for you and the one-shot prompt for the creation of the app.

If I significantly change the one-shot prompt, I will create new branches for the models. 

## About the app
This app allows users to log their weekly accomplishments in a simple and efficient manner. Users can add up to 5 bullet points each week, providing a quick overview of their achievements. The app also tracks the user's streak of weekly entries and offers motivational insights based on their logged data. It was designed to help users reflect on their progress and stay motivated and was inspired by Elon Musk's "DOGE email" where he told all federal employees to report "what they got accomplished this week in a simple, 5 bullet point format."

### Tech Stack
- Frontend: React + Vite (TypeScript) + Tailwind CSS
- Backend: Azure Functions (Node.js + TypeScript)
- Database: SQLite via better-sqlite3
- Auth: Simulated (userId = `test-user`)

### Monorepo Structure
```
/api  – Azure Functions (TypeScript)
/web  – React + Vite + Tailwind
/db   – SQLite schema and seed scripts
```

### Prerequisites
- Node.js 18+
- Azure Functions Core Tools v4

### Setup
1. Copy env examples
```pwsh
Copy-Item .env.example .env -ErrorAction SilentlyContinue
Copy-Item web/.env.example web/.env -ErrorAction SilentlyContinue
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

### API Overview
- POST /entries  – Create weekly entry (max 5 items). If already exists for week, returns 409 with existing id.
- GET /entries   – List entries (most recent first)
- GET /entries/:id – Get one entry
- PUT /entries/:id – Replace items (max 5)
- DELETE /entries/:id – Delete entry
- GET /streak – Return `{ streak: number }`
- GET /entries/:id/insight – Returns `{ insight: string }`

All requests implicitly target user `test-user`.

### Notes
- Week starts on Monday (ISO). Stored as YYYY-MM-DD (UTC).
- Insight is stubbed: "You're staying balanced across life areas!"

### Troubleshooting
- If Functions host fails, ensure Azure Functions Core Tools v4 is installed and PATH configured.
- Delete `/db/5bulletmethod.db` to reset and re-run init/seed.
- CORS for web dev is allowed via `local.settings.json` (copy example to `api/local.settings.json` if needed).
