---
id: inline-status
title: Inline Resource Status
status: approved
story: Production/Gateways/Gateway list
tags: [status, inline, icons, progress]
components:
  - PatternFly Icon
  - PatternFly Spinner
  - GatewayStatus
---

# Inline Resource Status

## When to use

Use for status inside a table row, detail header, list item, or compact summary.

## When not to use

Use `status-summary` for aggregate condition and `status-chart` for
distribution across many resources.

## HyperShell decision

Use the compact inline pattern: semantic icon or inline progress indicator
followed by visible plain text, with no label or chip container.

The shared bounded mapping recognizes:

- success: active, available, healthy, ready, running, succeeded;
- warning: degraded, warning;
- inactive: expired, revoked;
- pending: pending;
- progress: provisioning, reconciling, revoking, deleting, updating;
- danger: error, failed;
- unknown: every other value.

## Canonical example

`Production/Gateways/Gateway list`

## Required states

- Success.
- Warning.
- Danger.
- Pending.
- Progress.
- Inactive.
- Unknown.

## Accessibility

- Keep icon and visible text together.
- Hide the icon from assistive technology when the adjacent text carries the
  same meaning.
- Never use color alone.

## Responsive behavior

- Keep icon and label together.
- Do not replace the label with an icon at narrow widths.

## Do

- Use the shared status component and bounded status mapping.
- Respect an explicit caller label when it is more specific.
- Show `Attention required` for unhealthy values without a better label.

## Don't

- Create a route-local status mapper.
- Show an unrecognized value as healthy.
- Add a chip or custom colored dot around the inline treatment.

## Related

- `status-vocabulary`
- `status-summary`
- `status-chart`

