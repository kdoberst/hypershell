# Conformance and Automated Checks

## Purpose

These checks connect implementation evidence to the owning requirement, pattern,
and repository command. They do not replace the design, coverage, usability, or
accessibility catalogs; they prove that the selected work was executed and
recorded.

Every result must be one of `PASS`, `FAIL`, `NOT_RUN`, or a justified `N/A`.
`NOT_RUN` and `N/A` are not passes.

## Check contract

| ID | Check | Run when | Evidence | Fail when |
|----|-------|----------|----------|-----------|
| CONF-001 | Requirement conformance | Any UI-bearing change | Owning spec or work-item requirement, implementation decision, and observed result | Code does not satisfy the contract, or the contract is too ambiguous to verify |
| CONF-002 | Pattern conformance | A selected pattern or foundation applies | Pattern IDs, implementation decision, deviations, and pattern checker result when the library changes | Implementation ignores a selected pattern or deviates without authority |
| CONF-003 | Check-selection record | Any UI-bearing change | Applicable checks and commands selected by changed surface | A command is omitted because the change is low tier or small |
| CONF-004 | Command evidence | Any command is applicable | Command, working directory, result, and relevant failure summary | A pass is claimed without a command result, or a failure is summarized as success |
| CONF-005 | Exclusions | A check or command is not applicable | Excluded item and reason | A check is silently skipped or excluded only to save time |
| CONF-006 | Generated artifacts | Generated code, SDK, routes, stories, locale messages, or fixtures change | Generator command and resulting diff | Generated output is edited by hand or generation drift is ignored |
| CONF-007 | Formatting and lint | Browser source, Storybook, mockups, scripts, or generated files change | Formatter and lint results | Formatting or lint failures are suppressed or ignored |
| CONF-008 | Type and build checks | TypeScript, route, Storybook, package, or production UI code changes | Typecheck and build results | Type or build errors are treated as non-blocking without an owning-spec decision |
| CONF-009 | Unit and interaction tests | Component, hook, view, reducer, adapter, story, or fixture logic changes | Test command and coverage of changed behavior | New behavior has no test, or a relevant test is not run |
| CONF-010 | Storybook checks | Production or mockup stories change | Storybook build and relevant interaction-test result | Stories fail to build, render an error, or do not exercise the declared state |
| CONF-011 | Cross-package regression | A shared package, component, token, route contract, or data mapping changes | Consumer list, affected package checks, and regression-test selection | A consumer is known but not checked or updated |
| CONF-012 | Repository policy | Any UI-bearing change | Required repository policy result, such as forbidden DOM injection or spec ID checks | A mandatory policy is skipped or fails |
| CONF-013 | PR evidence | A change is ready for review | Check IDs, results, command evidence, exclusions, deviations, and human-review decision | The PR claims completion without a reproducible evidence record |

## Command matrix

Use the narrowest applicable command first, then broaden when shared code,
routing, generated output, or cross-package behavior changes.

| Changed surface | Current command |
|-----------------|------------------|
| Web-console production UI, stories, routes, locale messages, or mockups | `pnpm --dir components/web-console check` |
| Gateway management shared UI | `pnpm --filter @openshift-online/hypershell-gateway-management-ui check` |
| Operational dashboard shared UI | `pnpm --filter @openshift-online/hypershell-operational-dashboard-ui check` |
| Browser source, Storybook, or mockups | `make check-forbidden-dom-injection` |
| Pattern library index or documents | `python3 skills/web-console/ui-change-flow/scripts/check_ui_pattern_library.py` |
| Mockup TSX or CSS files | `python3 skills/web-console/ui-change-flow/scripts/check_mockup_patternfly.py <files...>` |
| Spec IDs or spec registry | `make check-spec-ids` |
| Browser interaction or workflow behavior | Relevant Vitest or Playwright suite; use live/e2e commands only when the owning task requires that environment |

These are current repository locations. When a script moves into the unified
check-catalog skill, update this matrix in the same change.

## Command rules

- Run commands from the repository root unless the command matrix states a
  package-specific invocation.
- Record the exact command and result. For a failure, record the actionable
  error, not only a generic nonzero status.
- Do not rerun a command until it accidentally passes; fix the cause or record a
  specific infrastructure blocker.
- Do not delete or weaken a test to make a change pass.
- Do not add broad exclusions, lint ignores, type ignores, or snapshot updates
  without an implementation-record reason.
- Do not commit generated screenshots, HAR files, or parity artifacts.

## Approved-mockup policy

For a new or materially changed production page with an approved mockup, follow
`skills/build/ui-build-gate/SKILL.md` and do not report the page complete until
the gate reaches a completion state. If the runtime cannot inspect images, follow
the gate's documented complete-without-visual-review path.

When no approved mockup exists, skip visual parity but continue every other
applicable check. State the reason in the implementation record.
