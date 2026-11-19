---
id: status-vocabulary
title: Status Vocabulary and Treatment
status: approved
tags: [status, icons, health]
---

# Status Vocabulary and Treatment

## When to use

Use whenever a UI presents health, operational state, severity, or a summary of
resource condition.

## HyperShell decision

Use the shared `HealthStatus` component or the equivalent production shared
component. Pass an explicit semantic appearance instead of choosing an icon in
page-owned markup.

- Danger, error, failed, or unhealthy: red `ExclamationCircleIcon`.
- Warning, degraded, or impaired: yellow `ExclamationTriangleIcon`.
- Good, healthy, or clear: green `CheckCircleIcon`, with `Healthy` as the
  default label.
- Pending: neutral `PendingIcon`.
- Provisioning, reconciling, revoking, deleting, or updating: inline progress.
- Expired or revoked: inactive `BanIcon`.
- Unrecognized values: gray `UnknownIcon`; never render unknown as healthy.

Keep the icon and label together. Never use color alone to communicate status.

For summary headings such as `Needs attention`, derive the icon from the
highest-severity item: danger outranks warning, and warning outranks good.

## Canonical components

- Shared HyperShell `HealthStatus`
- PatternFly status icons and semantic color tokens
- PatternFly `Label`, `Badge`, or `Card` status treatments when appropriate

## Required states

Define danger, warning, healthy, inactive, pending, progress, unknown, and
not-applicable treatments when the data source can produce them. Do not
silently render unknown as healthy.

## Accessibility

- Expose the visible status label to assistive technology.
- Keep icon and label together in reading and visual order.
- Do not use color, shape, or icon alone as the status message.
- Use concise, consistent status text.

## Do

- Reuse the shared status component.
- Map domain states to semantic appearance in one place.
- Use the highest severity for aggregate status.

## Don't

- Choose a different icon per page for the same semantic status.
- Use custom colored dots or text-only status indicators.
- Turn a partial failure into a general page error when resource-level status
  remains useful.

## Related

- `icon-status-tokens`
- `status-summary`
- `collection-table`
- `dashboard-section`

