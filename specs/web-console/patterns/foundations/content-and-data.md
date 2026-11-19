---
id: content-and-data
title: Content and Data Presentation
status: approved
tags: [content, data, dates, fixtures]
---

# Content and Data Presentation

## When to use

Use for visible values, dates, counts, identifiers, endpoints, commands, empty
copy, and fixture data.

## HyperShell decision

- Use `MMM dd, yyyy` for English date-only values, for example `Oct 05, 2026`.
- With time, use the same date format and localized time, for example
  `Oct 05, 2026, 9:35 PM`.
- Consequential timestamps must include the required time-zone context.
- Show unknown or missing values as an explicit value such as `Unknown`; do not
  show a blank cell without meaning.
- Use realistic deterministic data in stories and tests.
- Explain what a count or summary includes when access, filters, or time ranges
  affect it.

## Canonical components

- PatternFly `Content`, `DescriptionList`, `Table`, `ClipboardCopy`, and
  `Truncate` as appropriate.

## Required states

Define empty, unknown, long-value, and unavailable-value treatment. For
commands and endpoints, define copy behavior and failure behavior.

## Accessibility

- Associate long identifiers with an accessible full value when truncated.
- Avoid relying only on color to distinguish data categories.
- Use labels for units and time ranges.

## Do

- Use believable names, counts, dates, endpoints, and status values.
- Keep precision appropriate to the user decision.
- Explain counts that respect authorization or filters.

## Don't

- Use lorem ipsum, `foo`, `bar`, or unrealistic production names.
- Hide missing data as an empty string.
- Introduce a new date format for one page.

## Related

- `terminology`
- `state-coverage`
- `command-output`

