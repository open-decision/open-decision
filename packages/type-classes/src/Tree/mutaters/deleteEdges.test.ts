import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteEdges } from "./deleteEdges";
import { beforeEach, expect, test } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteEdges should properly delete an edge", () => {
  deleteEdges(currentTreeMock)(["3abeee1c-9662-4af5-a232-037228949002"]);

  expect(currentTreeMock.edges).toMatchInlineSnapshot(`
      {
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

test("deleteEdges should not fail when a passed in edgeId has not been found", () => {
  deleteEdges(currentTreeMock)(["test"]);

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
