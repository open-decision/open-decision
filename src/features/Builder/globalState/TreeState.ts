import produce from "immer";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { connections, node, nodes, nodeTypes, portTypes } from "../types";

export type TreeData = {
  nodes: nodes;
  nodeTypes: nodeTypes;
  portTypes: portTypes;
  connections: connections;
  creationTarget?: string;
};

type Methods = {
  setInitialState: (newData: TreeData) => void;
  addNode: (
    node: Partial<node> & Required<Pick<node, "id" | "coordinates" | "type">>
  ) => void;
  removeNode: (node: node) => void;
  setNode: (node: Partial<node> & Required<Pick<node, "id">>) => void;
  addConnection: (output: string, input: string) => void;
  removeConnection: (inputNodeId: string, outputNodeId: string) => void;
};

export type TreeState = { data: TreeData } & Methods;

export const useTreeStore = create<TreeState>(
  devtools(
    (set) => ({
      data: {
        connections: {},
        nodes: {},
        nodeTypes: {},
        portTypes: {},
        creationTarget: undefined,
      },
      setInitialState: (newData) =>
        set(
          produce((state: TreeState) => {
            state.data = newData;
          })
        ),
      addNode: (node) =>
        set(
          produce((state: TreeState) => {
            const config = state.data.nodeTypes[node.type];

            state.data.nodes[node.id] = {
              ...node,
              name: node.name ?? config.label,
            };
          })
        ),
      removeNode: (node) =>
        set(
          produce(({ data }: TreeState) => {
            delete data.nodes[node.id];
          })
        ),
      setNode: (node) =>
        set((state) => ({
          ...state,
          data: {
            ...state.data,
            nodes: {
              ...state.data.nodes,
              [node.id]: { ...state.data.nodes[node.id], ...node },
            },
          },
        })),
      addConnection: (outputNodeId, inputNodeId) =>
        set(
          produce(({ data }: TreeState) => {
            //Stop Nodes from being connected to itself.
            if (inputNodeId === outputNodeId) return;

            //Create an empty array for the output nodes connections if their is not already data.
            if (!data.connections[outputNodeId])
              data.connections[outputNodeId] = [];

            //Find a possible existing connection between the two Nodes.
            const existingConnection = data.connections[outputNodeId].find(
              (id) => id === inputNodeId
            );

            //Only add the new connection when their is not an existing connection between them.
            if (!existingConnection)
              data.connections[outputNodeId].push(inputNodeId);
          })
        ),
      removeConnection: (inputNodeId, outputNodeId) =>
        set(
          produce(({ data }: TreeState) => {
            const connections = data.connections[inputNodeId];

            const connectionToDelete = connections.findIndex(
              (id) => id === outputNodeId
            );

            connections.splice(connectionToDelete, 1);
          })
        ),
    }),
    "Tree"
  )
);
