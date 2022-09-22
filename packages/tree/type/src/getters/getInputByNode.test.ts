import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getInputsByNode } from "./getInputsByNode";

test("should get input when provided a node id", () => {
  const inputs = getInputsByNode(treeMock)(
    "e35ba071-6c5f-414f-98b1-a898305e038c"
  );

  expect(inputs).toHaveProperty("7adcfc07-cefd-45a8-ba42-c19860eb26c5");
});

test("should return undefined when no inputs corresponds to the node", () => {
  const input = getInputsByNode(treeMock)(
    "9716912b-a124-4148-9faf-afb04629aca1"
  );

  expect(input).toBeUndefined();
});
