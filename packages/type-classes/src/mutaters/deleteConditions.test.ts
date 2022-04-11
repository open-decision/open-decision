import { clone } from "ramda";
import { treeMock } from "../mocks/tree.mock";
import { deleteConditions } from "./deleteConditions";
import { expect, beforeEach, test } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteConditions should properly delete a condition", () => {
  deleteConditions(currentTreeMock)(["9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"]);

  expect(currentTreeMock.conditions).toMatchInlineSnapshot(`
    {
      "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
        "answer": "Vielleicht",
        "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
        "inputId": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
        "type": "select",
      },
    }
  `);
  expect(treeMock.edges).toMatchInlineSnapshot(`
    {
      "3abeee1c-9662-4af5-a232-037228949002": {
        "data": {
          "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
        },
        "id": "3abeee1c-9662-4af5-a232-037228949002",
        "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "target": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "type": "default",
      },
      "5aef09a9-ddde-4913-b139-e28421a7ada0": {
        "data": {
          "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
        },
        "id": "5aef09a9-ddde-4913-b139-e28421a7ada0",
        "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "target": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "type": "default",
      },
    }
  `);
});

test("deleteConditions should delete all edges related to the removed condition", () => {
  deleteConditions(currentTreeMock)(["9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"]);

  expect(currentTreeMock.edges).toMatchInlineSnapshot(`
    {
      "3abeee1c-9662-4af5-a232-037228949002": {
        "data": {
          "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
        },
        "id": "3abeee1c-9662-4af5-a232-037228949002",
        "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "target": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "type": "default",
      },
      "5aef09a9-ddde-4913-b139-e28421a7ada0": {
        "data": {
          "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
        },
        "id": "5aef09a9-ddde-4913-b139-e28421a7ada0",
        "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "target": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "type": "default",
      },
    }
  `);
});

test("deleteConditions should not fail when a passed in conditionId has not been found", () => {
  deleteConditions(currentTreeMock)(["test"]);

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
        "inputId": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
        "type": "select",
      },
    }
  `);
});
