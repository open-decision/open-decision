import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteNodes } from "./deleteNodes";
import { expect, test, beforeEach } from "vitest";
import { Tree } from "../type-classes";

let currentTreeMock: Tree.TTree;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteNodes should properly delete the node", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.nodes).not.toHaveProperty(
    "65f93264-6354-4e0b-86c1-3cc9e85db77a"
  );
});

test("deleteNodes should remove all edges using the node as a source or target", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.edges).not.toHaveProperty(
    "3abeee1c-9662-4af5-a232-037228949002"
  );
});

test("deleteNodes should remove all inputs related to the node", () => {
  deleteNodes(currentTreeMock)(["65f93264-6354-4e0b-86c1-3cc9e85db77a"]);

  expect(currentTreeMock.inputs).not.toHaveProperty(
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );
});
