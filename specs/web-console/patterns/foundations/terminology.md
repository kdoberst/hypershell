---
id: terminology
title: Product Terminology
status: approved
tags: [content, terminology, vocabulary]
---

# Product Terminology

## When to use

Use this foundation in every UI-bearing change that adds or changes visible
labels, headings, descriptions, action names, status text, errors, or empty
states.

## HyperShell decision

- Use `gateway` for the gateway that connects to OpenShell. Keep the `g`
  lowercase unless it begins a sentence or label.
- Use `Provision gateway`, not `Add gateway`, for the action that creates a
  gateway.
- Write `HyperShell`, `OpenShell`, and `Red Hat` exactly as shown.
- Use `internal Red Hat` or `internal to Red Hat` for access descriptions.
  Use `Red Hat Internal` only for the data security classification.
- Prefer plain task language over implementation jargon. Expose a system name
  only when the user needs it to complete or understand the task.

## Canonical components

- PatternFly `Content`, `Title`, `Button`, and form label components.
- Shared HyperShell action components when they already exist.

## Required states

Terminology must remain consistent across loading, empty, error, permission,
success, and partial-failure states.

## Accessibility

- Labels must identify the object and action, for example `Delete
  payments-gateway`.
- Do not rely on tooltip text as the only name for a control.
- Keep status labels adjacent to their semantic icons.

## Do

- Use the same noun for the same object across navigation, table columns,
  detail pages, commands, and errors.
- Use action names that describe the user outcome.
- Use terminology from the product spec and existing flows.

## Don't

- Introduce synonyms such as `instance`, `connector`, or `environment` for
  gateway unless the domain model explicitly defines them.
- Use abbreviations such as `RH`, `OS`, or `HS`.
- Change action terminology in one state but not the others.

## Related

- `status-vocabulary`
- `content-and-data`

