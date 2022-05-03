import { treeMock } from "../mocks/tree.mock";
import { updateStartNode } from "./updateStartNode";
import { expect, test } from "vitest";

test("updateStartNode mutably updates the startNode of the provided tree.", () => {
  updateStartNode(treeMock)("72444c0f-8838-43f6-b395-bf3207386ac2");

  expect(treeMock.startNode).toBe("72444c0f-8838-43f6-b395-bf3207386ac2");
});

test("updateStartNode should not change the startNode to a non existent Node.", () => {
  expect(updateStartNode(treeMock)("test")).toBeInstanceOf(Error);
});
