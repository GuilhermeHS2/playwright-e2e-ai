# AI-assisted workflow

How AI is used in this repo, and how much of its output survives review.

## Tools

- **Playwright MCP**: lets an agent drive a real browser through the accessibility tree.
- **Playwright test agents** (`.claude/agents/`, created with `npx playwright init-agents --loop=claude`):
  - `planner` explores the app and writes a test plan to `specs/`;
  - `generator` runs each step in the browser and writes a draft spec;
  - `healer` reruns a failing test, finds the cause and proposes a fix.

## Protocol

1. The planner writes the plan. I edit it: remove what has no value, add the edge cases it missed.
2. The generator writes a draft. The raw draft is saved untouched in `drafts/`.
3. I review and rewrite the draft into `tests/`: Page Objects, fixtures, real assertions.
4. Each test gets one row in `log.csv`.
5. When a test fails, the healer proposes a fix. I accept, change or reject it, and log that too.

The diff between `drafts/` and `tests/` is the evidence of what the human review changed.

## Log (`log.csv`)

| column | values |
|---|---|
| `test` | spec path in `tests/` |
| `source` | `generator`, `healer` or `manual` |
| `outcome` | `as-is`, `edited` or `rejected` |
| `changes` | what I changed: `locator`, `assertion`, `wait`, `structure`, `data`, `scope` (`;`-separated) |
| `note` | one line on why |

## Results

Filled from `log.csv` once the suite is complete. No numbers before there is data.
