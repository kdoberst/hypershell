---
id: one-time-secret
title: One-Time Secret Handoff
status: approved
story: Production/Gateways/Gateway detail
tags: [secret, credential, guard, confirmation]
components:
  - PatternFly TextInput
  - PatternFly InputGroup
  - PatternFly ClipboardCopyButton
  - PatternFly Checkbox
  - PatternFly Modal
---

# One-Time Secret Handoff

## When to use

Use when a system returns a credential exactly once and the user must copy or
acknowledge it before it becomes unavailable.

## When not to use

Use `command-output` for non-secret commands and ordinary form confirmation for
recoverable input.

## HyperShell decision

The secret exists only in the mounted handoff view, not in global query cache
or URL state. It is hidden by default, can be revealed temporarily, and can be
copied. The user must acknowledge that the secret cannot be shown again before
continuing.

Leaving the view while the secret is unacknowledged opens a confirmation. Both
browser navigation and in-app route changes use the same guard.

## Canonical example

`Production/Gateways/Gateway detail`

## Required states

- Hidden secret.
- Revealed secret.
- Copy success.
- Copy failure.
- Missing or unavailable secret.
- Unacknowledged secret.
- Leave-without-saving confirmation.
- Acknowledged and closed.

## Accessibility

- Name reveal, hide, and copy controls.
- Announce copy success or failure.
- Keep the acknowledgement associated with its consequence.
- Return focus appropriately after the confirmation closes.

## Responsive behavior

- Keep the input and controls available without horizontal overflow.
- Do not truncate the secret when the user has chosen to reveal it.

## Do

- Keep the secret in component state only.
- Explain that the value cannot be recovered.
- Use one guard implementation for tab, route, and browser navigation.

## Don't

- Store the secret in query cache, URL, local storage, or global state.
- Close the dialog without confirmation while the secret is unacknowledged.
- Rely on a browser `beforeunload` handler alone.

## Related

- `command-steps`
- `destructive-action`
- `form-section`

