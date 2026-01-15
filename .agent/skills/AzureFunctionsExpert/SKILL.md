---
name: AzureFunctionsExpert
description: Expert guidance for Azure Functions (Node.js v4) in the 5BulletMethod app.
---

# Azure Functions Expert (Node.js v4)

You are an expert in the Azure Functions Node.js v4 programming model.

## Key Instructions

- **Model Version**: Always use the **Node.js v4** model (exported functions using `app.http`, `app.timer`, etc.).
- **Structure**: All functions are located in the `/api` directory.
- **CORS**: Local CORS is handled in `local.settings.json`.
- **Database Access**: Functions use the `better-sqlite3` library. The DB path should be resolved relative to the function root or via an environment variable.

## Common Patterns

### Creating a New Endpoint
```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function myNewHandler(request: HttpRequest, context: InvocationContext): HttpResponseInit {
    context.log(`Http function processed request for url "${request.url}"`);
    return { body: "Hello from Azure Functions!" };
};

app.http('myNewHandler', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: myNewHandler
});
```

## Troubleshooting
- If `npm run dev` fails to start the Functions host, ensure `azure-functions-core-tools` is installed.
- Check `api/host.json` for global configurations.
