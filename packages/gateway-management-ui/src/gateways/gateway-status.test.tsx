import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { GatewayStatus } from "./gateway-status";
import styles from "./gateway-status.module.css";

function renderStatus(status: string) {
  return render(
    <IntlProvider locale="en">
      <GatewayStatus status={status} />
    </IntlProvider>,
  );
}

describe("GatewayStatus", () => {
  it("renders success as an icon and plain text without a label chip", () => {
    const { container } = renderStatus("Running");

    expect(screen.getByText("Running")).toBeTruthy();
    expect(container.querySelector(".pf-v6-c-label")).toBeNull();
    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-success svg"),
    ).toBeTruthy();
  });

  it("renders transitional status with an inline progress indicator", () => {
    const { container } = renderStatus("Updating");

    expect(screen.getByText("Updating")).toBeTruthy();
    expect(container.querySelector(".pf-v6-c-spinner")).toBeTruthy();
  });

  it("renders warning status with the warning icon treatment", () => {
    const { container } = renderStatus("Unavailable");

    expect(screen.getByText("Attention required")).toBeTruthy();
    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-warning svg"),
    ).toBeTruthy();
  });

  it("renders danger status with the danger icon treatment", () => {
    const { container } = renderStatus("Failed");

    expect(screen.getByText("Attention required")).toBeTruthy();
    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-danger svg"),
    ).toBeTruthy();
  });

  it("renders pending status with the pending icon treatment", () => {
    const { container } = renderStatus("Pending");

    expect(screen.getByText("Pending")).toBeTruthy();
    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-info svg"),
    ).toBeTruthy();
  });

  it("renders inactive status with the subtle status treatment", () => {
    const { container } = renderStatus("Expired");
    const inactiveClassName = styles.unknown;

    expect(screen.getByText("Expired")).toBeTruthy();
    expect(inactiveClassName).toBeDefined();
    if (!inactiveClassName) {
      throw new Error("Inactive status style is unavailable");
    }
    expect(container.querySelector(`.${inactiveClassName}`)).toBeTruthy();
  });

  it("renders unknown statuses with the neutral status color", () => {
    const { container } = renderStatus("Future status");
    const unknownClassName = styles.unknown;

    expect(screen.getByText("Future status")).toBeTruthy();
    expect(unknownClassName).toBeDefined();
    if (!unknownClassName) {
      throw new Error("Unknown status style is unavailable");
    }
    expect(container.querySelector(`.${unknownClassName}`)).toBeTruthy();
  });
});
