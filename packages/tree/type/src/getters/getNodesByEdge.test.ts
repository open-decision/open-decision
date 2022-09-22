import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getNodesByEdge } from "./getNodesByEdge";

test("should get nodes when provided an edge id", () => {
  const nodes = getNodesByEdge(treeMock)(
    "b23db9f6-d6d6-4984-a4fb-c52751a374b2"
  );

  expect(nodes.source).toHaveProperty(
    "id",
    "72444c0f-8838-43f6-b395-bf3207386ac2"
  );
  expect(nodes.target).toHaveProperty(
    "id",
    "9716912b-a124-4148-9faf-afb04629aca1"
  );
});
