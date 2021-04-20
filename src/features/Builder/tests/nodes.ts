import { connections, nodes, nodeTypes, portTypes } from "../types";

export const exampleNodes: nodes = {
  node1: {
    id: "node1",
    coordinates: [612.3076923076923, 452.30769230769226],
    type: "addNumbers",
    name: "Addiere zwei Zahlen",
  },
  node2: {
    id: "node2",
    coordinates: [218.4615384615384, 467.28205128205127],
    type: "number",
    name: "Irgendwas mit Nummer",
  },
  node3: {
    id: "node3",
    coordinates: [669.7051282051282, 254.30769230769232],
    type: "number",
    name: "Whatever",
  },
  node6: {
    id: "node6",
    coordinates: [265.6410256410257, 183.58974358974365],
    type: "number",
    name: "Test",
  },
};

export const exampleConnections: connections = {
  node2: ["node1", "node3"],
  node6: ["node3"],
};

export const examplePortTypes: portTypes = {
  number: {
    type: "number",
    label: "Number",
    name: "number",
    acceptTypes: ["number"],
    color: "red",
  },
};

export const exampleNodeTypes: nodeTypes = {
  default: { type: "default", label: "Default" },
  input: { type: "input", label: "Input" },
  output: { type: "output", label: "Output" },
};
