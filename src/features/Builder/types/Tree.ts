import * as T from "io-ts";
import { exampleNodeTypes, examplePortTypes } from "../testData/nodes";
import * as Node from "./Node";

const PortConfig = T.type({
  type: T.string,
});

const NodeConfig = T.intersection([
  T.type({
    type: T.string,
    label: T.string,
  }),
  T.partial({
    description: T.string,
    inputPorts: T.array(PortConfig),
    outputPorts: T.array(PortConfig),
  }),
]);

const PortTypes = T.record(T.string, PortConfig);
const NodeTypes = T.record(T.string, NodeConfig);

const TreeConfig = T.type({
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
});

const TreeState = T.type({
  treeName: T.string,
  id: T.string,
  nodes: Node.NodeRecord,
});
const TreeType = T.intersection([
  T.type({
    config: TreeConfig,
  }),
  TreeState,
]);

function createTree(): TTree {
  return {
    id: "tree",
    config: {
      nodeTypes: exampleNodeTypes,
      portTypes: examplePortTypes,
    },
    nodes: {},
    treeName: "Unbenannt",
  };
}

export const Tree = { Type: TreeType, createTree };

export type TNodeConfig = T.TypeOf<typeof NodeConfig>;
export type TNodeTypes = T.TypeOf<typeof NodeTypes>;
export type TPortConfig = T.TypeOf<typeof PortConfig>;
export type TPortTypes = T.TypeOf<typeof PortTypes>;

export type TTree = T.TypeOf<typeof TreeType>;
