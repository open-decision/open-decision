import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { relateInputToCondition } from "./relateInputCondition";
import { expect, test, beforeEach } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});
test("relateInputToCondition should add an existing inputId to the condition of the provided id", () => {
  relateInputToCondition(currentTreeMock)(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(currentTreeMock.conditions).toMatchInlineSnapshot(`
      {
        "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99": {
          "answer": "Ja",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          "type": "select",
        },
        "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
          "answer": "Vielleicht",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          "type": "select",
        },
      }
    `);
});

test("relateInputToCondition should return an Error if the condition could not be found and not change the tree", () => {
  const error = relateInputToCondition(currentTreeMock)(
    "test",
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe"
  );

  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});

test("relateInputToCondition should return an Error if the input could not be found and not change the tree", () => {
  const error = relateInputToCondition(currentTreeMock)(
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    "test"
  );
  expect(error).toBeInstanceOf(Error);
  expect(currentTreeMock).toMatchObject(currentTreeMock);
});
