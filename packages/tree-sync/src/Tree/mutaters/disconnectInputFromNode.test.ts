import { treeMock } from "../mocks/tree.mock";
import { disconnectInputAndNode } from "./disconnectInputFromNode";
import { expect, test } from "vitest";

disconnectInputAndNode(treeMock)(
  "65f93264-6354-4e0b-86c1-3cc9e85db77a",
  "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
);

test("removeInputFromNode should clear the input from the node of the provided id", () => {
  expect(
    treeMock.nodes?.["65f93264-6354-4e0b-86c1-3cc9e85db77a"].data.inputs
  ).not.toContain("50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});
