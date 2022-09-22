import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getNodesByInput } from "./getNodesByInput";

test("should get nodes when provided an input id", () => {
  const nodes = getNodesByInput(treeMock)(
    "7adcfc07-cefd-45a8-ba42-c19860eb26c5"
  );

  expect(nodes).toHaveProperty("72444c0f-8838-43f6-b395-bf3207386ac2");
  expect(nodes).toHaveProperty("e35ba071-6c5f-414f-98b1-a898305e038c");
});

test("should return undefined when no inputs corresponds to the node", () => {
  const input = getNodesByInput(treeMock)(
    "8b394f09-3fbb-4dfa-81e4-aea570e5d4cc"
  );

  expect(input).toBeUndefined();
});
