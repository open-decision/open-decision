import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getConditionsByNode } from "./getConditionsByNode";

test("should get condition when provided a node id", () => {
  const condition = getConditionsByNode(treeMock)(
    "e35ba071-6c5f-414f-98b1-a898305e038c"
  );

  expect(condition).toHaveProperty("ff9accd5-a509-4071-a503-a2ae6e2d3d7c");
});

test("should return undefined when no condition corresponds to the node", () => {
  const condition = getConditionsByNode(treeMock)(
    "9716912b-a124-4148-9faf-afb04629aca1"
  );

  expect(condition).toBeUndefined();
});
