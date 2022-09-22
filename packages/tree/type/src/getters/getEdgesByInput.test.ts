import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getEdgesByInput } from "./getEdgesByInput";

test("should get edges when provided an input id", () => {
  const edges = getEdgesByInput(treeMock)(
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(edges).toHaveProperty("c1e29a28-6916-4829-b096-6405b3ae7336");
});

test("should return undefined when no edges corresponds to the input", () => {
  const condition = getEdgesByInput(treeMock)(
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f"
  );

  expect(condition).toBeUndefined();
});
