import { clone } from "remeda";
import { vi, beforeEach, test, expect } from "vitest";
import { Edge } from "../type-classes";
import { treeMock } from "../mocks/tree.mock";
import { addEdge, createAndAddEdge } from "./addEdge";
import { createEdge } from "../creators";

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

test("addEdge should mutably add a provided Edge to the provided tree", () => {
  const newEdge = createEdge(currentTreeMock)({
    source: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
    target: "72444c0f-8838-43f6-b395-bf3207386ac2",
    data: { conditionId: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99" },
  }) as Edge.TEdge;

  addEdge(currentTreeMock)(newEdge);

  expect(currentTreeMock.edges).toMatchInlineSnapshot(`
    {
      "1": {
        "data": {
          "conditionId": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
        },
        "id": 1,
        "source": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "target": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "type": "default",
      },
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

test("createAndAddInput should add a new Edge to the provided tree", () => {
  createAndAddEdge(currentTreeMock)({
    source: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
    target: "72444c0f-8838-43f6-b395-bf3207386ac2",
    data: {
      conditionId: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
    },
  });

  expect(currentTreeMock.edges).toMatchInlineSnapshot(`
    {
      "2": {
        "data": {
          "conditionId": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
        },
        "id": 2,
        "source": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "target": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "type": "default",
      },
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
