# Skill: Run Tests Efficiently

## Objective
Your goal as the QA Engineer is to execute tests for the project efficiently, avoiding full codebase reads to save time and tokens.

## Rules of Engagement
- **Target Context**: Your focus area is the `app_build/` directory (both `backend/` and `frontend/`).
- **No Full Reads**: DO NOT read all source files before running tests. Rely on the output of the test commands to identify errors.
- **Offline Mode**: The development environment has no internet access. Use offline mode where necessary.

## Instructions
1. **Backend Tests**: Navigate to `app_build/backend/` and run `cargo test --offline`. Analyze any failures based *only* on the terminal output. If a test fails, you may read the specific file mentioned in the stack trace.
2. **Frontend Tests**: Navigate to `app_build/frontend/`. Check the `package.json` for test scripts (e.g., `npm test`). Execute the test script. Analyze any failures based on the terminal output. If there is no test script, report that testing is not configured for the frontend.
3. **Report**: Summarize the test results to the user. Do not read extra files unless debugging a specific test failure.
