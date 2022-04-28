import { Tree } from "../type-classes";
import { Required } from "utility-types";

export const treeMock: Required<Tree.TTree, "startNode"> = {
  startNode: "e35ba071-6c5f-414f-98b1-a898305e038c",
  nodes: {
    "e35ba071-6c5f-414f-98b1-a898305e038c": {
      id: "e35ba071-6c5f-414f-98b1-a898305e038c",
      type: "customNode",
      position: { x: 0, y: 0 },
      data: {
        inputs: ["7adcfc07-cefd-45a8-ba42-c19860eb26c5"],
        content: [],
        name: "Erster Knoten",
        conditions: ["ff9accd5-a509-4071-a503-a2ae6e2d3d7c"],
      },
    },
    "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
      id: "65f93264-6354-4e0b-86c1-3cc9e85db77a",
      type: "customNode",
      position: { x: 0, y: 0 },
      data: {
        inputs: ["50b7733c-c7ab-4035-b26f-801ea8eca9fe"],
        content: [],
        name: "Zweiter Knoten",
        conditions: ["9c07e4c3-a67f-4c76-8c14-9a0a302b5d99"],
      },
    },
    "72444c0f-8838-43f6-b395-bf3207386ac2": {
      id: "72444c0f-8838-43f6-b395-bf3207386ac2",
      type: "customNode",
      position: { x: 0, y: 0 },
      data: {
        inputs: ["7adcfc07-cefd-45a8-ba42-c19860eb26c5"],
        content: [],
        name: "Dritter Knoten",
        conditions: ["ff9accd5-a509-4071-a503-a2ae6e2d3d7c"],
      },
    },
  },
  conditions: {
    "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99": {
      id: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
      inputId: "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
      answerId: "3b923bd4-f9f9-4309-bc04-9fafd5c1b2f4",
      type: "select",
    },
    "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
      id: "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
      inputId: "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
      answerId: "dfec1b30-fc51-43a6-9e6f-db71933a8274",
      type: "select",
    },
  },
  inputs: {
    "50b7733c-c7ab-4035-b26f-801ea8eca9fe": {
      id: "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
      type: "select",
      answers: [{ id: "3b923bd4-f9f9-4309-bc04-9fafd5c1b2f4", text: "Ja" }],
    },
    "7adcfc07-cefd-45a8-ba42-c19860eb26c5": {
      id: "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
      type: "select",
      answers: [
        { id: "3c5827b3-2565-4623-850b-de463a5ee946", text: "Nein" },
        { id: "dfec1b30-fc51-43a6-9e6f-db71933a8274", text: "Vielleicht" },
      ],
    },
  },
  edges: {
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
  },
};

export const emptyTreeMock: Tree.TTree = {};
