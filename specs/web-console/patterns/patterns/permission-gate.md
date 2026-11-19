---
id: permission-gate
title: Route Permission Gate
status: candidate
tags: [permissions, access, gate, empty-state]
components:
  - PatternFly EmptyState
  - PatternFly Spinner
  - PatternFly PageSection
---

# Route Permission Gate

## When to use

Use when an entire route requires authentication or an administrative role
before any route content should load.

## When not to use

Use an inline info alert when only some controls or data are unavailable.

## HyperShell decision

Show a full-page spinner while session authorization is resolving. If the user
is unauthenticated or lacks the required role, replace the route with a
full-page access-denied empty state. Do not render partially authorized content
behind the gate.

## Canonical example

No dedicated Storybook state exists yet. The implementation is
`components/web-console/app/features/dashboard/require-dashboard-admin.tsx`.

## Required states

- Session loading.
- Authenticated and authorized.
- Unauthenticated.
- Authenticated without required role.

## Accessibility

- Name the session-loading spinner.
- Use a page-level heading for access denied.
- Explain what the user can do next when an action exists.

## Responsive behavior

- Center or fill the page without horizontal overflow.
- Keep the message and any next action within the viewport.

## Do

- Resolve authorization before fetching protected route data.
- Hide admin-only navigation when the user is unauthorized.
- Use the same access-denied treatment across protected routes.

## Don't

- Render protected content while authorization is pending.
- Expose role names as the only explanation.
- Use a generic error for an authorization decision.

## Related

- `state-coverage`
- `empty-state`
- `application-shell`

