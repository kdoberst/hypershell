---
id: create-flow
title: Create or Provision Flow
status: approved
story: Mockups/Gateways/Provision gateway
tags: [create, form, wizard, action]
components:
  - PatternFly Form
  - PatternFly Button
  - PatternFly Alert
  - PatternFly Wizard
---

# Create or Provision Flow

## When to use

Use when a user creates or provisions a resource and the task needs one or more
structured inputs.

## When not to use

- Use a modal for a small, single-purpose creation action.
- Use a form section when editing an existing resource without provisioning
  semantics.

## HyperShell decision

Use `Provision gateway` for creating a gateway. Use a page-level flow for
multi-step provisioning and a modal only when the task is short and does not
need persistent context.

The flow must make the result and exit explicit:

- the object being created;
- required inputs;
- consequences of proceeding;
- progress after submission;
- success exit;
- recovery from validation and API failure.

## Canonical example

`Mockups/Gateways/Provision gateway`

## Required states

- Initial.
- Validation failure.
- Submitting.
- Success.
- API failure.
- Permission limited.
- Recovery after partial provisioning.

## Accessibility

- Keep step and field labels associated with their inputs.
- Summarize validation errors in an alert and link or focus the first invalid
  field.
- Do not disable the primary action merely to hide validation; if disabled,
  provide an explanatory reason.
- Preserve entered data during recovery where technically possible.

## Responsive behavior

- Stack form fields and wizard navigation.
- Keep the primary action visible and in a stable position.
- Do not truncate required validation messages.

## Do

- Use deterministic, realistic defaults where safe.
- Explain consequences before submission.
- Provide a clear exit back to the collection or new resource.

## Don't

- Use `Add gateway` for gateway provisioning.
- Hide required constraints until submit.
- Leave an in-progress provisioning operation without status or recovery.

## Related

- `form-section`
- `error-recovery`
- `terminology`

