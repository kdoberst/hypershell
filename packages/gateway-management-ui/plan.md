# Implementation Plan: Update Daily Note - Jira

**Branch**: `004-daily-jira-items` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-daily-jira-items/spec.md`

**Note**: Stack and testing per Constitution **Principles VII–IX** (Jest, Node.js script stack,
skill quality gates). Reuse `.agents/scripts/lib/load-config.js`, `resolve-date.js`, and
section/placeholder patterns from features 001–003. New skill at `.agents/skills/` for
`#question-awaiting-reply` only. Jira Cloud REST API v3 via built-in `fetch` (zero runtime npm
deps); auth from env vars `JIRA_SITE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`.

## Summary

Deliver a Node.js CLI (`sync-daily-jira-items.js`) that updates the jira-automation region in an
**existing** daily note: resolve date (default today), verify **Jira auth env**, load issues via
**Jira REST API v3** (normal HTTP calls, not MCP), run a **fetch → classify → apply** pipeline,
merge lines by issue key (never remove `- [x]` or manual content), remove configured placeholders
only when inserting items, persist comment classification state in `.agents/state/daily-jira-items.json`,
and optionally apply `#question-awaiting-reply` via a semver skill. Auth failure **stops
immediately** with stderr alert - no fetch, no note writes. Script completes without the skill if
question classification fails.

## Technical Context

**Stack**: Constitution Principles VII–VIII (default; no deviations). External access: **Jira Cloud
REST API v3** via Node built-in `fetch` - **sole** source for Jira data (issues, comments, viewer
identity via `/rest/api/3/myself`).

**Jira access**:

- **Env vars** (required for Basic auth v1):
  - `JIRA_SITE_URL` - e.g. `https://yoursite.atlassian.net` (trailing slash stripped)
  - `JIRA_EMAIL` - Atlassian account email
  - `JIRA_API_TOKEN` - API token from Atlassian account settings
- **Optional**: `JIRA_OAUTH_TOKEN` - Bearer auth if set (legacy Bob supported; Basic preferred when
  token pair is set)
- **Single account**: operator uses one Jira login; no multi-account switching in v1
- **Auth gate**: verify all required env vars **before** reading the note or calling Jira. On
  failure → stderr alert (list missing vars), exit 1, note unchanged
- **Network**: live Jira calls require outbound HTTPS; may need to run **outside a sandbox**
  (Cursor agent sandbox blocks arbitrary hosts)

**Storage**:

- Input: `configs/daily_template.json` (jira region), existing daily note, Jira Cloud via REST
- State: `.agents/state/daily-jira-items.json` (`lastCommentId`, `classified`, `lastUnresolved`
  per issue key)
- Output: in-place update to resolved daily note path (`configs/daily_template.json.file_name`)

**Config-driven section mapping** (see [spec.md § Config-driven Jira section mapping](./spec.md#config-driven-jira-section-mapping)):

| Config key           | Role in sync                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `automation: "jira"` | Node is the sync target; all other sections untouched                  |
| `title`              | Locate region in note by markdown heading at depth `2 + nesting level` |
| `placeholders[]`     | Removable stub lines (FR-009)                                          |

Single flat list - no sub-buckets (unlike github's four regions).

**Fetch / apply pipeline** (internal; mirrors legacy Bob `sync.js fetch|apply`):

| Phase        | Output                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **fetch**    | `matched[]`, `pendingClassification[]`, `resolvedPings[]`, `carryUnresolvedTag[]`, `commentCursors{}`   |
| **classify** | `classifications[]` as `{ key, commentId, isQuestion }` only (skill or `--no-skill-classify`)           |
| **apply**    | merge note, write state; advance `lastCommentId` only when all pending comments for that key classified |

**Testing**: Jest unit tests for inclusion rules, merge, placeholder removal, line formatting,
state cursor logic, ADF→text ping detection (in-memory only); manual validation via
[quickstart.md](./quickstart.md) **with network outside sandbox**

**Target Platform**: macOS vault workspace; vault root as cwd

**Project Type**: CLI script + one companion skill

**Performance Goals**: Under 30 seconds for ~100 candidate issues/comments (SC-005)

**Constraints**:

- Zero runtime npm packages; `fetch` + `node:fs` for all Jira.com access
- Auth failure is fatal - alert user and exit; no partial sync or silent skip
- Section headings from config only (Principle VI)
- `- [x]` lines never removed or modified (FR-012)
- Skill under `.agents/skills/classify-jira-question/`; pass SkillSpector + skillsaw (Principle IX); register the skill path in `.github/component-paths.json` and update `.github/workflows/lint.yml` via `/maintain-ci` when the skill is added
- Skill authored with `kim-write-for-llm`; concise LLM-oriented prose
- Title/URL never from classification payload (FR-014)

**Scale/Scope**: One jira region; six reason tags; state file grows with seen issue keys;
`configs/daily_template.json` already defines `automation: "jira"` on the Jira section

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                    | Requirement                                              | Status            |
| ---------------------------- | -------------------------------------------------------- | ----------------- |
| I. Obsidian Vault Native     | Markdown note updates in vault paths                     | ✅ PASS           |
| II. Scripts Over Skills      | Deterministic sync script; skill only for question pings | ✅ PASS           |
| III. Full Documentation      | JSDoc + README + skill SKILL.md                          | ✅ PASS (planned) |
| IV. Skill Semver             | Skill declares MAJOR.MINOR.PATCH                         | ✅ PASS (planned) |
| V. Skills Compose Scripts    | Skill classifies; script fetches/merges                  | ✅ PASS (planned) |
| VI. Config-Driven References | Jira region from `automation`/`title`/`placeholders[]`   | ✅ PASS (planned) |
| VII. Isolated Unit Testing   | Jest; no I/O under `templates/` or `Daily_Notes/`        | ✅ PASS (planned) |
| VIII. Node.js Script Stack   | `.agents/scripts/`, ES modules, zero runtime deps        | ✅ PASS           |
| IX. Skill Quality Gates      | SkillSpector + skillsaw before complete                  | ✅ PASS (planned) |

**Post-design re-check**: Contracts and data model enforce single jira region, env auth gate,
fetch/apply state ordering, merge preservation, and optional skill invocation; no gate failures.

## Execution flow

```text
1. Parse CLI args (--date, --config, --no-skill-classify, optional --fetch-only / --apply-json)
2. assertJiraAuth()         → fail fast if env missing
3. loadConfig()             → configs/daily_template.json
4. findJiraRegion()         → single automation:"jira" node
5. resolveNotePath()        → fail if daily note missing
6. readState()              → .agents/state/daily-jira-items.json
7. fetchJiraData()          → REST: JQL rules 1/3/4 + comment ~ displayName for rule 2
8. [optional] classify pings → skill or skip; output { key, commentId, isQuestion }[]
9. applyJiraSync()          → merge section, write state (cursor rules), resolve title/url
10. Write note if changed   → stdout updated:|unchanged:
```

## Project Structure

### Documentation (this feature)

```text
specs/004-daily-jira-items/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md                    # via /speckit-tasks
├── contracts/
│   ├── sync-daily-jira-items-cli.md
│   └── classify-jira-question-skill.md
└── spec.md
```

### Source Code (repository root)

```text
.agents/scripts/
├── sync-daily-jira-items.js       # Main CLI (new)
├── lib/
│   ├── load-config.js             # Reused
│   ├── resolve-date.js            # Reused
│   ├── jira-config.js             # assertJiraAuth, jiraRequest (new)
│   ├── jira-fetch.js              # fetchJiraData, JQL, comments, ADF text (new)
│   ├── jira-classify.js           # Deterministic rules + tags (new)
│   ├── jira-state.js              # read/write state, persistApplyState (new)
│   ├── jira-line-format.js        # `- [ ] [KEY: Title](url) #tags` (new)
│   ├── jira-merge.js              # Merge by issue key; preserve - [x] (new)
│   ├── jira-note.js               # Locate jira region; insert above --- (new)
│   └── jira-placeholder.js        # Placeholder removal before insert (new)
├── __tests__/
│   └── sync-daily-jira-items.test.js  # (new)
└── README.md

.agents/skills/
└── classify-jira-question/
    └── SKILL.md                   # #question-awaiting-reply classifier (new)

.agents/state/
└── daily-jira-items.json          # Created/updated at runtime (gitignored if sensitive)

configs/
└── daily_template.json            # Existing jira section (no schema change required)

package.json                       # npm run sync-daily-jira-items
```

**Structure Decision**: Single CLI with focused `lib/` modules; fetch/apply split as exported
functions (legacy Bob `sync.js` logic ported to ES modules). `jira-note.js` adapts
`github-note.js` patterns for one top-level region ending at `---`. Placeholder logic mirrors
feature 003. State file path matches legacy Bob for migration continuity.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| -         | -          | -                                    |
