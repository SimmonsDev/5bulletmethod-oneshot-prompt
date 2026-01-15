---
description: Verify the local API status and basic data
---

1. Check if the Azure Functions API is responding
```pwsh
# Ensure the API is running locally (usually port 7071)
$apiUrl = "http://localhost:7071/api/entries"
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get -ErrorAction Stop
    Write-Host "✅ API is responding. Entry count: $($response.Count)"
} catch {
    Write-Error "❌ API is not responding at $apiUrl. Ensure 'npm run dev' is running."
}
```

2. Check the test-user streak
```pwsh
$streakUrl = "http://localhost:7071/api/streak"
try {
    $streak = Invoke-RestMethod -Uri $streakUrl -Method Get -ErrorAction Stop
    Write-Host "🔥 Current streak for test-user: $($streak.streak)"
} catch {
    Write-Error "❌ Could not fetch streak."
}
```
