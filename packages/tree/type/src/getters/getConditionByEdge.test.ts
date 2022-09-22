import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getConditionByEdge } from "./getConditionsByEdge";

test("should get condition when provided an edge id", () => {
  const condition = getConditionByEdge(treeMock)(
    "3abeee1c-9662-4af5-a232-037228949002"
  );

  expect(condition).toHaveProperty(
    "id",
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c"
  );
});

test("should return undefined when no condition corresponds to the edge", () => {
  const condition = getConditionByEdge(treeMock)(
    "b23db9f6-d6d6-4984-a4fb-c52751a374b2"
  );

  expect(condition).toBeUndefined();
});
