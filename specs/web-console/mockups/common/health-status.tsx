import { Icon, Spinner } from "@patternfly/react-core";
import {
  BanIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PendingIcon,
  UnknownIcon,
} from "@patternfly/react-icons";

import styles from "./health-status.module.css";

export type HealthStatusAppearance =
  | "danger"
  | "inactive"
  | "pending"
  | "progress"
  | "success"
  | "unknown"
  | "warning";

export function HealthStatus({
  appearance = "success",
  label = "Healthy",
}: {
  appearance?: HealthStatusAppearance;
  label?: React.ReactNode;
}) {
  let statusIcon: React.ReactNode;
  switch (appearance) {
    case "danger":
      statusIcon = (
        <Icon isInline status="danger">
          <ExclamationCircleIcon aria-hidden />
        </Icon>
      );
      break;
    case "inactive":
      statusIcon = (
        <Icon isInline>
          <BanIcon aria-hidden />
        </Icon>
      );
      break;
    case "pending":
      statusIcon = (
        <Icon isInline status="info">
          <PendingIcon aria-hidden />
        </Icon>
      );
      break;
    case "progress":
      statusIcon = <Spinner aria-hidden isInline role="presentation" />;
      break;
    case "success":
      statusIcon = (
        <Icon isInline status="success">
          <CheckCircleIcon aria-hidden />
        </Icon>
      );
      break;
    case "unknown":
      statusIcon = (
        <Icon isInline>
          <UnknownIcon aria-hidden />
        </Icon>
      );
      break;
    case "warning":
      statusIcon = (
        <Icon isInline status="warning">
          <ExclamationTriangleIcon aria-hidden />
        </Icon>
      );
      break;
  }

  return (
    <span
      className={
        appearance === "inactive" || appearance === "unknown"
          ? [styles.status, styles.subtle].join(" ")
          : styles.status
      }
    >
      {statusIcon}
      <span>{label}</span>
    </span>
  );
}
