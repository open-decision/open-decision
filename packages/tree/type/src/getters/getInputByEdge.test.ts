import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getInputByEdge } from "./getInputByEdge";

test("should get input when provided an edge id", () => {
  const input = getInputByEdge(treeMock)(
    "a176bb34-4c55-413e-acae-016880b682ec"
  );

  expect(input).toHaveProperty("id", "7adcfc07-cefd-45a8-ba42-c19860eb26c5");
});

test("should return undefined when no inputs corresponds to the edge", () => {
  const input = getInputByEdge(treeMock)(
    "b23db9f6-d6d6-4984-a4fb-c52751a374b2"
  );

  expect(input).toBeUndefined();
});
