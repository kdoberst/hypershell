---
id: landing-card-grid
title: Landing Card Grid
status: approved
story: Production/Homepage
tags: [landing, cards, overview, quick-create]
components:
  - PatternFly Card
  - PatternFly Grid
  - PatternFly Flex
  - HomepageCard
---

# Landing Card Grid

## When to use

Use for a non-dashboard landing page that combines a primary call to action,
current condition, help, and secondary platform information.

## When not to use

Use `dashboard-page` when the page is primarily metrics and customizable
widgets. Use `collection-table` when users need to compare records.

## HyperShell decision

Use a secondary page body and a responsive card grid. Cards have a leading icon,
concise title, task-oriented body, and optional footer action. The primary
landing action is a large primary button; a clear secondary action sits beside
it.

Each data-backed card owns its loading and unavailable state. An announcement,
when present, appears above the grid.

## Canonical example

`Production/Homepage`

## Required states

- Loaded.
- Per-card loading.
- Per-card unavailable.
- Announcement present.
- Non-administrator.
- Quick create pending.
- Quick create error.

## Accessibility

- Use card headings below the page or section heading.
- Name icon-only and quick-create actions.
- Keep loading and unavailable messages within the card they describe.
- Do not use icons alone to explain card purpose.

## Responsive behavior

- Stack the grid at narrow widths.
- Keep primary and secondary actions available.
- Preserve card order by task priority.

## Do

- Put the user's primary next action first.
- Use per-card states rather than blocking the whole page.
- Keep support and help actions easy to find.

## Don't

- Mix one-off card shells when `HomepageCard` fits.
- Add decorative cards without a task purpose.
- Hide loading state by rendering zero values.

## Related

- `page-layout`
- `dashboard-section`
- `metric-unavailable`

