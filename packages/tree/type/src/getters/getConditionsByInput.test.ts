import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getConditionsByInput } from "./getConditionByInput";

test("should get condition when provided an input id", () => {
  const condition = getConditionsByInput(treeMock)(
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(condition).toHaveProperty("9c07e4c3-a67f-4c76-8c14-9a0a302b5d99");
});

test("should return undefined when no condition corresponds to the input", () => {
  const condition = getConditionsByInput(treeMock)(
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(condition).toBeUndefined();
});
