import { Tree } from "../type-classes";
import { Required } from "utility-types";

export const treeMock: Required<Tree.TTree, "startNode"> = {
  startNode: "e35ba071-6c5f-414f-98b1-a898305e038c",
  nodes: {
    "e35ba071-6c5f-414f-98b1-a898305e038c": {
      id: "e35ba071-6c5f-414f-98b1-a898305e038c",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Erster Knoten",
    },
    "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
      id: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Zweiter Knoten",
    },
    "72444c0f-8838-43f6-b395-bf3207386ac2": {
      id: "72444c0f-8838-43f6-b395-bf3207386ac2",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Dritter Knoten",
    },
    "9716912b-a124-4148-9faf-afb04629aca1": {
      id: "9716912b-a124-4148-9faf-afb04629aca1",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Dritter Knoten",
    },
    "53118f18-a522-4f1d-b2b5-78b306a97651": {
      id: "53118f18-a522-4f1d-b2b5-78b306a97651",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Dritter Knoten",
    },
    "8edc4369-3906-4dbc-be29-b560c742a806": {
      id: "8edc4369-3906-4dbc-be29-b560c742a806",
      type: "customNode",
      position: { x: 0, y: 0 },
      name: "Dritter Knoten",
    },
  },
  conditions: {
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99": {
      id: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
      data: { answerId: "3b923bd4-f9f9-4309-bc04-9fafd5c1b2f4" },
      type: "select",
    },
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
      id: "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
      data: { answerId: "dfec1b30-fc51-43a6-9e6f-db71933a8274" },
      type: "select",
    },
    "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f": {
      id: "5a3c055f-b0df-4dda-a1fb-12fef66e3c8f",
      type: "select",
    },
  },
  edges: {
    "a176bb34-4c55-413e-acae-016880b682ec": {
      id: "a176bb34-4c55-413e-acae-016880b682ec",
      source: "53118f18-a522-4f1d-b2b5-78b306a97651",
      target: "e35ba071-6c5f-414f-98b1-a898305e038c",
      type: "default",
      conditionId: "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    },
    "3abeee1c-9662-4af5-a232-037228949002": {
      id: "3abeee1c-9662-4af5-a232-037228949002",
      source: "e35ba071-6c5f-414f-98b1-a898305e038c",
      target: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      type: "default",
      conditionId: "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    },
    "5aef09a9-ddde-4913-b139-e28421a7ada0": {
      id: "5aef09a9-ddde-4913-b139-e28421a7ada0",
      source: "e35ba071-6c5f-414f-98b1-a898305e038c",
      target: "72444c0f-8838-43f6-b395-bf3207386ac2",
      type: "default",
      conditionId: "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
    },
    "b23db9f6-d6d6-4984-a4fb-c52751a374b2": {
      id: "b23db9f6-d6d6-4984-a4fb-c52751a374b2",
      source: "72444c0f-8838-43f6-b395-bf3207386ac2",
      target: "9716912b-a124-4148-9faf-afb04629aca1",
      type: "default",
    },
    "c1e29a28-6916-4829-b096-6405b3ae7336": {
      id: "c1e29a28-6916-4829-b096-6405b3ae7336",
      source: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      target: "72444c0f-8838-43f6-b395-bf3207386ac2",
      type: "default",
      conditionId: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
    },
  },
};

export const emptyTreeMock: Tree.TTree = {
  startNode: "e35ba071-6c5f-414f-98b1-a898305e038c",
  nodes: {
    "e35ba071-6c5f-414f-98b1-a898305e038c": {
      id: "e35ba071-6c5f-414f-98b1-a898305e038c",
      position: { x: 0, y: 0 },
      type: "customNode",
      name: "",
    },
  },
};
