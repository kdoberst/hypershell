---
id: icon-status-tokens
title: Icon and Status Tokens
status: approved
tags: [icons, status, color, tokens, classes]
---

# Icon and Status Tokens

## When to use

Use whenever adding or changing a status icon, status color, inline progress
indicator, alert severity, or the accessible label that accompanies a status.

## HyperShell decision

The canonical production implementation is `GatewayStatus` in
`packages/gateway-management-ui/src/gateways/gateway-status.tsx`. It derives one
of seven semantic appearances from the domain status and renders a PatternFly
icon or inline spinner followed by visible text.

Do not choose status icons or colors in page-owned markup. Pass the domain status
to the shared component, or extend that component when a new domain state needs
an appearance.

## Canonical status mapping

| Appearance | Domain statuses | Icon or indicator | PatternFly `Icon` status | Status token | Rendered PatternFly class |
|---|---|---|---|---|---|
| `success` | `active`, `available`, `healthy`, `ready`, `running`, `succeeded` | `CheckCircleIcon` | `success` | `--pf-t--global--icon--color--status--success--default` | `.pf-v6-c-icon__content.pf-m-success` |
| `warning` | `degraded`, `warning` | `ExclamationTriangleIcon` | `warning` | `--pf-t--global--icon--color--status--warning--default` | `.pf-v6-c-icon__content.pf-m-warning` |
| `danger` | `error`, `failed` | `ExclamationCircleIcon` | `danger` | `--pf-t--global--icon--color--status--danger--default` | `.pf-v6-c-icon__content.pf-m-danger` |
| `pending` | `pending` | `PendingIcon` | `info` | `--pf-t--global--icon--color--status--info--default` | `.pf-v6-c-icon__content.pf-m-info` |
| `progress` | `provisioning`, `reconciling`, `revoking`, `deleting`, `updating` | PatternFly `Spinner` | none | PatternFly spinner token set | `.pf-v6-c-spinner` |
| `inactive` | `expired`, `revoked` | `BanIcon` | none | wrapper subtle text color | no status modifier |
| `unknown` | any unrecognized value | `UnknownIcon` | none | wrapper subtle text color | no status modifier |

`inactive` and `unknown` use the shared wrapper's `.unknown` source class, which
sets `color: var(--pf-t--global--text--color--subtle)`. They intentionally do
not add a PatternFly success, warning, danger, or info modifier.

## Wrapper and class rules

The shared component uses these source classes from
`gateway-status.module.css`:

- `.status`: inline flex, vertical centering, small gap, and no wrapping.
- `.unknown`: subtle text color for inactive and unknown appearances.

CSS modules hash these names at build time. Application code must use the shared
component or import the CSS module; it must not target the generated class names
or copy the implementation into a route.

PatternFly's own component and modifier classes are stable implementation
details, not application styling APIs. Use `<Icon status="...">`, `<Spinner>`, or
the relevant PatternFly component instead of adding these classes by hand:

- `.pf-v6-c-icon`
- `.pf-v6-c-icon__content`
- `.pf-v6-c-icon__content.pf-m-success`
- `.pf-v6-c-icon__content.pf-m-warning`
- `.pf-v6-c-icon__content.pf-m-danger`
- `.pf-v6-c-icon__content.pf-m-info`
- `.pf-v6-c-spinner`

## Label rules

- Keep the icon or spinner and visible label adjacent.
- Hide the status icon from assistive technology with `aria-hidden` when the
  adjacent text carries the same meaning.
- Provide an explicit label when the domain status is not user-friendly.
- With no explicit label, warning and danger render `Attention required`.
- Preserve a caller-provided label even when it is more specific than the
  default.
- Never use color or icon shape as the only status carrier.

## Alert severity mapping

Use PatternFly `Alert` variants for page, section, or operation messages. Do not
manually replace an alert's built-in icon.

| Variant | Use for |
|---|---|
| `success` | A completed operation or accepted operation with a clear outcome. |
| `info` | Permission scope, context, or a harmless state the user should know. |
| `warning` | Degraded behavior, missing optional data, or a consequence that needs attention. |
| `danger` | API failure, operation failure, validation error, or an unsafe condition. |

## Non-status icon vocabulary

| Icon | Meaning |
|---|---|
| `SyncAltIcon` | Refresh the visible resource or data source. |
| `ExternalLinkAltIcon` | Opens a destination outside the current console. |
| `CopyIcon` | Copy the adjacent value, command, or secret. |
| `EllipsisVIcon` | Opens a row or object action menu. |
| `EyeIcon` | Reveal a hidden secret. |
| `EyeSlashIcon` | Hide a revealed secret. |

Do not use status icons as action icons. For example, `CheckCircleIcon` does not
mean `Save`, and `ExclamationTriangleIcon` does not mean `Cancel`.

## Known migration gaps

- The shared mockup `HealthStatus` component supports only `good`, `warning`,
  and `danger`. It remains valid for those three approved mockup appearances,
  but a mockup that needs pending, progress, inactive, or unknown status must
  extend the mockup component rather than composing a local icon mapping.
- The web-console homepage currently has a local `StatusIcon` implementation and
  selects `ExclamationTriangleIcon` for its success tone. It is a migration gap,
  not an approved alternative; migrate it to the shared production status
  treatment when homepage UI is next changed.

## Accessibility

- Name icon-only action controls with `aria-label` or visible text.
- Name spinners that are the primary loading indicator; hide inline decorative
  spinners that sit next to meaningful status text.
- Keep status text visible at narrow widths.
- Do not animate status icons; use the inline spinner only for progress.

## Do

- Use `GatewayStatus` for production resource status.
- Use the `HealthStatus` mockup component for approved mockups that only need
  good, warning, or danger appearances.
- Use PatternFly semantic status props and tokens.
- Extend the bounded domain-to-appearance mapping when a real state is missing.

## Don't

- Use raw hex colors for status.
- Add custom colored dots, chips, or icons around inline status.
- Map unknown or inactive values to success.
- Reuse a semantic icon for a different meaning.
- Hardcode PatternFly class names in application markup.

## Related

- `status-vocabulary`
- `inline-status`
- `status-summary`

