# playwright-e2e-ai

[![tests](https://github.com/GuilhermeHS2/playwright-e2e-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/GuilhermeHS2/playwright-e2e-ai/actions/workflows/ci.yml)

End-to-end and API test suite with Playwright and TypeScript, plus a documented workflow for using AI (Playwright MCP and Playwright test agents) to write and maintain tests.

**Latest test report:** https://guilhermehs2.github.io/playwright-e2e-ai/ (merged HTML report from the last CI run on `main`)

## Targets

| Layer | Target | Runs on |
|---|---|---|
| API | [ServeRest](https://github.com/ServeRest/ServeRest) (local, `npx serverest`) | `api` project |
| E2E | [the-internet](https://github.com/saucelabs/the-internet) (Docker image `gprestes/the-internet`) | Chromium, Firefox, WebKit |

Both apps start locally through Playwright `webServer`, so the suite never depends on a third-party site being up.

## What is tested

**API (ServeRest), 12 tests.** Every response body is validated with a [zod](https://zod.dev) schema.

| Area | Cases |
|---|---|
| Login | valid credentials return a bearer token; wrong password is 401; malformed body is 400 with field errors |
| Users | create, read, update and delete; duplicate email is 400 |
| Products | admin creates a product; no token is 401; non-admin token is 403 |
| Carts | creating a cart reserves stock and totals items; concluding keeps stock reduced; cancelling restores stock; ordering more than in stock is 400 |

Each test creates its own users and products with unique data and deletes them afterwards (carts first, then products, then users), so the tests run in parallel without sharing state.

**E2E (the-internet), 11 tests per browser.**

| Page | Cases |
|---|---|
| Form authentication | valid login reaches the secure area and logs out; wrong password shows an error |
| Checkboxes | toggle both boxes |
| Dropdown | select an option |
| File upload | upload a file and see its name |
| JavaScript alerts | alert, confirm (dismissed) and prompt (typed text) |
| Dynamic loading | hidden element revealed; element rendered after loading |
| Sortable data tables | sort by last name ascending and descending |

Not covered: the iframe page. In this image the TinyMCE editor loads from a third-party CDN without an API key, so it is not a self-contained target.

Tags: `@smoke` marks the fast happy paths, `@regression` the rest.

## Run it

Requirements: Node 24 and Docker.

```bash
npm ci
npx playwright install
npm test            # everything (starts ServeRest and the-internet)
npm run test:api    # API only
npm run test:e2e    # Chromium only
npm run smoke       # @smoke tag only
npm run typecheck   # tsc
npm run report      # open the HTML report
```

## Structure

```
tests/api/      API specs
tests/e2e/      browser specs
pages/          Page Objects (role and label locators first)
fixtures/       Playwright fixtures: ServeRest client, auth tokens, data factory, zod schemas, page objects
specs/          test plans (planner agent, reviewed)
ai-workflow/    AI workflow protocol, raw drafts and the review log
```

## CI

GitHub Actions runs on push, on pull requests and once a day, one job per project (`api`, `chromium`, `firefox`, `webkit`). Each job uploads a blob report; a final job merges them into one HTML report, which is published to GitHub Pages on pushes to `main`. Traces and screenshots are kept only for failed tests and uploaded as artifacts.

## AI-assisted workflow

The protocol for using the Playwright test agents (planner, generator, healer) and logging what human review changes is in [`ai-workflow/`](ai-workflow/). The log is empty for now; results will be reported there once there is data.

## Authorship

Test code written with Claude Code (AI) under my direction; I chose the targets, scope and structure.
