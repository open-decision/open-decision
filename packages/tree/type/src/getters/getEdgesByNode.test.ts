import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getEdgesByNode } from "./getEdgesByNode";

test("should get edges when provided a node id", () => {
  const edges = getEdgesByNode(treeMock)(
    "e35ba071-6c5f-414f-98b1-a898305e038c"
  );

  expect(edges?.source).toHaveProperty("5aef09a9-ddde-4913-b139-e28421a7ada0");
  expect(edges?.source).toHaveProperty("3abeee1c-9662-4af5-a232-037228949002");
  expect(edges?.target).toHaveProperty("a176bb34-4c55-413e-acae-016880b682ec");
});

test("should return undefined when no edges corresponds to the node", () => {
  const edges = getEdgesByNode(treeMock)(
    "8edc4369-3906-4dbc-be29-b560c742a806"
  );

  expect(edges?.source).toBeUndefined();
  expect(edges?.target).toBeUndefined();
});
