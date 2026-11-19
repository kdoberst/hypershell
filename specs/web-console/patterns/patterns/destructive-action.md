---
id: destructive-action
title: Destructive Action Confirmation
status: approved
story: Mockups/Gateways/Gateway list
tags: [danger, delete, confirmation, modal]
components:
  - PatternFly Modal
  - PatternFly Button
  - PatternFly Alert
---

# Destructive Action Confirmation

## When to use

Use when an action deletes data or permanently disables a resource with no easy
recovery.

## When not to use

- Use an inline confirmation for reversible state changes.
- Use `error-recovery` for reporting an already failed operation.

## HyperShell decision

Use the PatternFly deletion pattern:

- warning icon to the left of the modal title;
- danger treatment on the confirming primary action;
- clear object names and consequences in the body;
- cancel as the safe non-destructive action.

For bulk deletion, list or clearly count affected objects and expose the full
affected set in an accessible way.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- Closed.
- Open confirmation.
- Submitting.
- Success.
- Partial failure.
- API failure.

## Accessibility

- Focus the modal on open and return focus to the invoking control on close.
- Make the confirming action name specific, such as `Delete gateway`.
- Do not rely on color alone to communicate danger.
- Keep cancel reachable with keyboard and screen reader.

## Responsive behavior

- Keep the modal within the viewport.
- Stack actions rather than overflowing horizontally.
- Keep object names readable or expose them through an accessible detail.

## Do

- Disable confirmation when the user lacks permission, with a reason.
- Explain dependent resources or irreversible consequences.
- Keep recovery guidance available after partial failure.

## Don't

- Put the danger treatment on cancel.
- Use generic `Confirm` or `OK` as the primary action.
- Queue destructive work without a final visible outcome.

## Related

- `error-recovery`
- `collection-table`
- `terminology`

