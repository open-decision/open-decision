import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteInputs } from "./deleteInputs";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteInputs should properly delete the input", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(currentTreeMock.inputs).not.toHaveProperty(
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );
});

test("deleteInputs should remove the input relation from all Nodes", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(
    currentTreeMock.nodes?.["65f93264-6354-4e0b-86c1-3cc9e85db77a"].inputs
  ).not.toContain("50b7733c-c7ab-4035-b26f-801ea8eca9fe");
});

test("deleteInputs should remove all conditions related to the removed input", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(currentTreeMock.conditions).not.toHaveProperty(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );
});

test("deleteInputs should not fail and do nothing when a passed in inputId has not been found", () => {
  deleteInputs(currentTreeMock)(["test"]);

  expect(currentTreeMock.edges).toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );
  expect(currentTreeMock.conditions).toHaveProperty(
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"
  );
});
