import { describe, expect, it } from "vitest";

import { extractRealmRoles } from "./auth.js";

describe("extractRealmRoles", () => {
  it("reads roles from the roles claim", () => {
    expect(
      extractRealmRoles({
        roles: ["hypershell-admins", "hypershell-users"],
      }),
    ).toEqual(["hypershell-admins", "hypershell-users"]);
  });

  it("reads roles from the groups claim used by Keycloak", () => {
    expect(
      extractRealmRoles({
        groups: ["hypershell-admins", "hypershell-users"],
      }),
    ).toEqual(["hypershell-admins", "hypershell-users"]);
  });

  it("ignores non-string role entries", () => {
    expect(
      extractRealmRoles({
        roles: ["hypershell-admins", 42, null],
      }),
    ).toEqual(["hypershell-admins"]);
  });
});
