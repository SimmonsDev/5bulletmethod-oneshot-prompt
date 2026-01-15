---
description: Create a new branch for a model experiment
---

1. Please provide the name of the model you want to experiment with (e.g., gemini-2.0-flash).

2. Create and switch to the new branch
```pwsh
$modelName = "[user-input]"
$branchName = "experiment/$modelName"
git checkout -b $branchName
```

3. Read the one-shot prompt to prepare for "vibe coding"
```pwsh
# The agent should read the instruction file
Get-Content .github/prompts/5BulletMethod-OneShot-Demo.prompt.md
```

4. Inform the user that the branch has been created and the agent is ready to start coding based on the prompt.
