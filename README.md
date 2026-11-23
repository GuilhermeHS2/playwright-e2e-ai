# playwright-e2e-ai

[![tests](https://github.com/GuilhermeHS2/playwright-e2e-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/GuilhermeHS2/playwright-e2e-ai/actions/workflows/ci.yml)

End-to-end and API test suite with Playwright and TypeScript, plus a documented, measured workflow for using AI (Playwright MCP and Playwright test agents) to write and maintain tests.

> Work in progress.

## What is tested

| Layer | Target | Runs on |
|---|---|---|
| API | [ServeRest](https://github.com/ServeRest/ServeRest) (local, `npx serverest`) | `api` project |
| E2E | [the-internet](https://github.com/saucelabs/the-internet) (Docker) | Chromium, Firefox, WebKit |

Both apps start locally through Playwright `webServer`, so the suite never depends on a third-party site being up.

## Run it

Requirements: Node 24 and Docker.

```bash
npm ci
npx playwright install
npm test            # everything
npm run test:api    # API only
npm run smoke       # @smoke tag only
npm run report      # open the HTML report
```

## AI-assisted workflow

AI drafts, a human decides. Agents explore the app and write drafts; every test in `tests/` was reviewed and rewritten by hand. Drafts and the review log live in [`ai-workflow/`](ai-workflow/), including how many generated tests were kept as-is, edited or rejected.

## Structure

```
tests/api/      API specs
tests/e2e/      browser specs
pages/          Page Objects
fixtures/       Playwright fixtures
specs/          test plans (planner agent, reviewed)
ai-workflow/    raw AI drafts and the review log
```

## CI

GitHub Actions runs on push, on pull requests and once a day, one job per project. Traces are kept only on failure and uploaded as artifacts.
