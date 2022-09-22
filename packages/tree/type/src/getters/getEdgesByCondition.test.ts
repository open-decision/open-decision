import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getEdgesByCondition } from "./getEdgesByCondition";

test("should get edges when provided a condition id", () => {
  const edges = getEdgesByCondition(treeMock)(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c"
  );

  expect(edges).toHaveProperty("3abeee1c-9662-4af5-a232-037228949002");
  expect(edges).toHaveProperty("5aef09a9-ddde-4913-b139-e28421a7ada0");
});

test("should return undefined when no condition corresponds to the input", () => {
  const condition = getEdgesByCondition(treeMock)(
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(condition).toBeUndefined();
});
