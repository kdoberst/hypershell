---
id: state-coverage
title: Required State Coverage
status: approved
tags: [states, loading, empty, error, permissions]
---

# Required State Coverage

## When to use

Use when designing or implementing any page, component, or data-backed control.

## HyperShell decision

A visual input usually shows the success path only. HyperShell UI must define
all states that the user can encounter:

- Loading
- Empty
- Success with data
- Validation failure
- API or infrastructure error
- Permission limited
- Partial failure
- Recovery or retry
- Destructive confirmation where applicable

Not every component needs every state. The owning spec must say which states
apply and why.

## Canonical components

- PatternFly `Spinner`, `Skeleton`, `EmptyState`, `Alert`, `Button`, and form
  validation components.
- Shared HyperShell status and recovery components when available.

## Accessibility

- Announce important state changes without moving focus unexpectedly.
- Preserve control labels and context in each state.
- Provide an actionable recovery action where technically possible.
- Keep loading and error messages specific enough to guide the next decision.

## Do

- Show state within the affected page region when the rest of the page remains
  useful.
- Offer retry for recoverable API failures.
- Explain what the user can still do when permissions are limited.
- Keep state fixtures deterministic and realistic.

## Don't

- Ship a success-only screenshot as the complete design.
- Replace the whole page with an error when only one section failed.
- Use lorem ipsum or placeholder values.
- Leave a loading state without a recovery path for failure.

## Related

- `empty-state`
- `error-recovery`
- `content-and-data`

