# Coverage Checks

## Purpose

These checks define the observable surfaces and conditions that must be covered
before a UI change can be reported complete. Coverage is selected by changed
surface and consequence, not by UI tier.

`NOT_TESTED`, `BLOCKED`, `N/A`, and an automated-tool non-finding are not passes.
Every exclusion requires a reason.

## Check contract

| ID | Check | Run when | Authoritative source | Evidence | Fail when |
|----|-------|----------|----------------------|----------|-----------|
| COV-001 | Coverage inventory | Any UI-bearing change | Changed files and owning spec | Routes, components, states, roles, themes, viewports, and exclusions | The implementation record cannot state what was covered and what was not |
| COV-002 | Required states | Any stateful page, component, or data-backed control | `specs/web-console/patterns/foundations/state-coverage.md` | Applicable states and why nonapplicable states are excluded | A required loading, empty, success, validation, error, permission, partial-failure, recovery, or destructive-confirmation state is missing |
| COV-003 | Data boundaries | Visible values, collections, forms, commands, identifiers, dates, or counts change | `specs/web-console/patterns/foundations/content-and-data.md` | Empty, unknown, long, unicode, boundary, unavailable, and representative fixture cases | Success-only data, blank meaningless values, unrealistic fixtures, or unhandled boundary values are shipped |
| COV-004 | Roles and permissions | Data, actions, navigation, or visible content varies by access | Owning feature spec | Role matrix and permission-limited states | An unauthorized user sees restricted content or action, or a permitted user cannot complete the task |
| COV-005 | Visual modes | Color, background, status, chart, code, image, custom CSS, or theme-sensitive styling changes | PatternFly 6 theme guidance | Light and dark mode results for every changed visual state | A changed treatment is unreadable, invisible, or inconsistent in a supported mode |
| COV-006 | Responsive coverage | Page, table, form, dashboard, modal, toolbar, or stacking behavior changes | `specs/web-console/patterns/foundations/responsive-behavior.md` | Desktop and narrow-viewport results for loaded, empty, and error states | Narrow layout scrolls horizontally, traps content, hides required information, or loses the primary action |
| COV-007 | Locale and text expansion | User-facing text, layout, dates, numbers, or direction-sensitive UI changes | Owning localization requirements | Representative long text, non-English content, and RTL result when supported | Text clips, overlaps, truncates meaning, mirrors incorrectly, or formats locale-sensitive data incorrectly |
| COV-008 | Production Storybook coverage | A production component or page has meaningful states or user differences | Component or page Storybook setup | Story IDs and represented states, roles, modes, or viewports | A stateful production surface has no story, or stories cover only the success path |
| COV-009 | Automated tests | Production component, hook, view, or fixture logic changes | Repository test commands | Unit, type, lint, formatting, interaction, Storybook, and build results with failing or excluded commands explained | A relevant required test is not run, a failure is ignored, or a new behavior has no automated coverage |
| COV-010 | Regression scope | A shared component, pattern, utility, route, or data mapping changes | Consumers found by repository search | Consumers reviewed or updated and regression tests selected | A consumer breaks silently or is excluded without evidence |
| COV-011 | Recovery coverage | Async, workflow, mutation, retry, cancellation, refresh, or deep-link behavior changes | Owning feature spec | Success, failure, retry, cancellation, refresh, and deep-link outcomes | State is lost, duplicated, falsely reported successful, or left unrecoverable |

## State inventory

For each changed stateful surface, record which states apply:

- loading;
- empty;
- success with data;
- validation failure;
- API or infrastructure error;
- permission limited;
- partial failure;
- recovery or retry;
- destructive confirmation, where applicable.

The owning spec or implementation record must explain any excluded state. A
visual input that shows only success does not establish that other states are
unnecessary.

## Production Storybook rule

Add or update a production Storybook story when a component or page has
meaningful states, roles, modes, or viewport behavior. Stories must use
deterministic, realistic data and must not import live services.

For shared components, include enough stories to demonstrate the public API and
state contract. For page surfaces, include at least the states declared
applicable by the owning spec.

## Automated command selection

Run the narrowest commands that exercise the changed code, then broaden as
needed:

1. Component, hook, or view tests for directly changed files.
2. Package type, lint, formatting, Storybook, and build checks.
3. Cross-package checks when a shared component, pattern, utility, or contract
   changes.
4. Interaction or end-to-end tests when routing, workflow, or integration
   behavior changes.

Record command results. Do not replace a failed command with a claim that the
implementation is correct.
