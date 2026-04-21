---
description: Start the Autonomous AI Developer Pipeline sequence to efficiently run tests for the project.
---

When the user types `/runtest`, orchestrate the development process strictly using `.agents/agents.md` and `.agents/skills/`.

### Execution Sequence:
1. Shift context, act as the **QA Engineer (@qa)**, and execute the `run_tests.md` skill to run and evaluate tests without reading the entire codebase first. This is crucial for saving time and tokens.
