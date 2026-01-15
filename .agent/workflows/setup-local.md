---
description: Set up the local environment for 5BulletMethod
---

// turbo-all
1. Install all dependencies
```pwsh
npm run install:all
```

2. Setup environment variables
```pwsh
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}
```

3. Initialize the database
```pwsh
npm run db:init
```

4. Seed the database
```pwsh
npm run db:seed
```

5. Inform the user that setup is complete and they can run `npm run dev` to start.
