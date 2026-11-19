---
id: url-state-persistence
title: URL State Persistence
status: approved
story: Production/Gateways/Gateway list
tags: [url, state, sharing, routes]
components:
  - React Router search params
---

# URL State Persistence

## When to use

Use for shareable collection state, active detail tab, and attention deep links.

## When not to use

Do not persist secrets, unsaved form input, or transient modal state in the
URL.

## HyperShell decision

Search, filters, sort, order, page, page size, active tab, and attention target
are encoded in the URL. Filter changes replace history so typing does not create
one history entry per character. Defaults are omitted where practical.

Unknown values normalize to safe defaults rather than creating unsupported UI
states.

## Canonical example

`Production/Gateways/Gateway list`

## Required states

- Default URL.
- Filtered URL.
- Sorted URL.
- Paginated URL.
- Detail tab URL.
- Unknown or invalid parameter.
- Dismissed attention parameter.

## Accessibility

- Restore focus to the route heading after URL-driven navigation.
- Do not surprise users with history changes while they type.
- Keep page titles consistent with the represented state.

## Responsive behavior

- Preserve state across viewport changes.
- Do not encode viewport-specific layout in a shareable URL.

## Do

- Parse and serialize through one typed module.
- Reset page when filters or page size change.
- Use parameter prefixes for multiple collections on one page.

## Don't

- Let raw search parameters bypass enum validation.
- Encode sensitive or transient values.
- Create a separate URL contract for each route when a shared typed module is
  appropriate.

## Related

- `collection-table`
- `detail-tab-section`
- `operation-result`

