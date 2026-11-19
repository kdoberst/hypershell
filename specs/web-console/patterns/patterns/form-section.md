---
id: form-section
title: Form Section
status: approved
story: Mockups/Gateways/Provision gateway
tags: [form, inputs, validation]
components:
  - PatternFly Form
  - PatternFly FormGroup
  - PatternFly TextInput
  - PatternFly Select
  - PatternFly HelperText
---

# Form Section

## When to use

Use for a structured set of inputs, either in a page form or a multi-step
create flow.

## When not to use

- Use a filter toolbar when the only purpose is narrowing a collection.
- Use a modal form only for a short, low-context task.

## HyperShell decision

Use PatternFly form structure and helper text before custom layout. Group
inputs by the decision they support. Keep required constraints visible before
submission where possible.

## Canonical example

`Mockups/Gateways/Provision gateway`

## Required states

- Initial.
- Changed.
- Validation failure.
- Submitting.
- API failure.
- Permission-limited field.
- Recovered after retry.

## Accessibility

- Associate labels, inputs, helper text, and errors.
- Announce a validation summary and move focus to the first invalid field.
- Do not rely on placeholder text as label or constraint.
- Keep required state perceivable.

## Responsive behavior

- Stack fields in logical order.
- Keep helper and validation text visible.
- Do not truncate required constraints.

## Do

- Use realistic defaults and examples.
- Explain the consequence of security- or infrastructure-affecting choices.
- Preserve valid user input during recovery.

## Don't
- Create route-local input wrappers.
- Hide validation until after an unrelated action.
- Use color alone to mark invalid fields.

## Related

- `create-flow`
- `state-coverage`
- `content-and-data`

