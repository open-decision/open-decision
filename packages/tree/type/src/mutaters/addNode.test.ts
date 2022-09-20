import { clone } from "ramda";
import { vi, beforeEach, expect, test } from "vitest";
import { treeMock, emptyTreeMock } from "../mocks/tree.mock";
import { addInput } from "./addInput";
import { addNode, createAndAddNode } from "./addNode";
import { createInput, createNode } from "../creators";

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
let currentEmptyTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
  currentEmptyTreeMock = clone(emptyTreeMock);
});

test("addNode should mutably add a provided Node to the provided tree", () => {
  const newInput = createInput();
  const newNode = createNode({ data: { inputs: [newInput.id] } });
  addInput(currentTreeMock)(newInput);
  addNode(currentTreeMock)(newNode);

  expect(currentTreeMock.nodes).toMatchInlineSnapshot(`
    {
      "2": {
        "data": {
          "conditions": [],
          "inputs": [
            1,
          ],
          "name": "",
        },
        "id": 2,
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          ],
          "name": "Zweiter Knoten",
        },
        "id": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "72444c0f-8838-43f6-b395-bf3207386ac2": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          ],
          "name": "Dritter Knoten",
        },
        "id": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "e35ba071-6c5f-414f-98b1-a898305e038c": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          ],
          "name": "Erster Knoten",
        },
        "id": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
    }
  `);
});

test("addNode should assign the first created Node as the startNode", () => {
  const newInput = createInput();
  const newNode = createNode({ data: { inputs: [newInput.id] } });
  addInput(currentTreeMock)(newInput);
  addNode(currentEmptyTreeMock)(newNode);

  expect(currentEmptyTreeMock).toMatchInlineSnapshot(`
    {
      "nodes": {
        "4": {
          "data": {
            "conditions": [],
            "inputs": [
              3,
            ],
            "name": "",
          },
          "id": 4,
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
      },
      "startNode": 4,
    }
  `);
});

test("createAndAddNode should add a new Node to the provided tree", () => {
  const newInput = createInput();

  addInput(currentTreeMock)(newInput);
  createAndAddNode(currentTreeMock)({ data: { inputs: [newInput.id] } });

  expect(currentTreeMock.nodes).toMatchInlineSnapshot(`
    {
      "6": {
        "data": {
          "conditions": [],
          "inputs": [
            5,
          ],
          "name": "",
        },
        "id": 6,
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          ],
          "name": "Zweiter Knoten",
        },
        "id": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "72444c0f-8838-43f6-b395-bf3207386ac2": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          ],
          "name": "Dritter Knoten",
        },
        "id": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
      "e35ba071-6c5f-414f-98b1-a898305e038c": {
        "data": {
          "conditions": [
            "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          ],
          "content": [],
          "inputs": [
            "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          ],
          "name": "Erster Knoten",
        },
        "id": "e35ba071-6c5f-414f-98b1-a898305e038c",
        "position": {
          "x": 0,
          "y": 0,
        },
        "type": "customNode",
      },
    }
  `);
});
