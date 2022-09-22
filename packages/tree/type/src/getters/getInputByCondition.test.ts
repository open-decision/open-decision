import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getInputByCondition } from "./getInputByCondition";

test("should get input when provided a condition id", () => {
  const input = getInputByCondition(treeMock)(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );

  expect(input).toHaveProperty("id", "50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});

test("should return undefined when no edges corresponds to the condition", () => {
  const input = getInputByCondition(treeMock)(
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(input).toBeUndefined();
});
