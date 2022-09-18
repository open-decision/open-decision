import { clone } from "remeda";
import { vi, beforeEach, test, expect } from "vitest";
import { createCondition } from "../creators";
import { treeMock } from "../mocks/tree.mock";
import { addCondition } from "./addCondition";

vi.mock("uuid", () => {
  let counter = 0;
  return {
    v4: vi.fn(() => {
      ++counter;
      return counter;
    }),
  };
});

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("addCondition should mutably add a provided Condition to the provided tree", () => {
  const newCondition = createCondition({
    inputId: "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
    answerId: "Vielleicht",
  });
  addCondition(currentTreeMock)(newCondition);

  expect(currentTreeMock.conditions).toMatchInlineSnapshot(`
      {
        "1": {
          "answer": "Vielleicht",
          "id": 1,
          "inputId": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          "type": "select",
        },
        "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99": {
          "answer": "Ja",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          "type": "select",
        },
        "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
          "answer": "Vielleicht",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          "type": "select",
        },
      }
    `);
});
