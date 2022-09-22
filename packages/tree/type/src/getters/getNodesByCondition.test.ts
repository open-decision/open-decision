import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getNodesByCondition } from "./getNodesByCondition";

test("should get nodes when provided a condition id", () => {
  const nodes = getNodesByCondition(treeMock)(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(nodes).toHaveProperty("65f93264-6354-4e0b-86c1-3cc9e85db77a");
});

test("should return undefined when no nodes corresponds to the condition", () => {
  const nodes = getNodesByCondition(treeMock)(
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(nodes).toBeUndefined();
});
