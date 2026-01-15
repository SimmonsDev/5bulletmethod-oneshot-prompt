---
description: Reset the SQLite database to a clean seeded state
---

// turbo-all
1. Remove the existing database file
```pwsh
if (Test-Path db/5bulletmethod.db) {
    Remove-Item db/5bulletmethod.db
}
```

2. Initialize the database schema
```pwsh
npm run db:init
```

3. Seed the database with initial data
```pwsh
npm run db:seed
```
