import { pipe } from "fp-ts/function";
import * as T from "io-ts";
import * as Node from "./Node";
import * as Record from "fp-ts/Record";
import * as Array from "fp-ts/Array";

// ------------------------------------------------------------------
// Tree Config
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

const Config = T.type({
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
});

// ------------------------------------------------------------------
// Tree State

const State = T.type({
  treeName: T.string,
  id: T.string,
  nodes: Node.NodeRecord,
  selectedNodeId: T.string,
  selectedRelation: T.string,
});

export const Type = T.intersection([
  T.type({
    config: Config,
  }),
  State,
]);

// ------------------------------------------------------------------
// Tree Methods

export function create(name: string): TTree {
  return {
    id: "tree",
    config: {
      nodeTypes: {},
      portTypes: {},
    },
    nodes: {},
    treeName: name,
    selectedNodeId: "",
    selectedRelation: "",
  };
}

export const getParents = (node: Node.TNode) => (tree: TTree) =>
  pipe(
    tree.nodes,
    Record.toArray,
    Array.chain(([, comparedNode]) =>
      pipe(
        comparedNode.data.relations,
        Record.toArray,
        Array.filter(([, relation]) => relation.target === node.id),
        Array.map(() => comparedNode.id)
      )
    )
  );

export const getChildren = (node: Node.TNode) => (tree: TTree) =>
  pipe(tree.nodes[node.id], (node) =>
    pipe(
      node.data.relations,
      Record.toArray,
      Array.filter(([, relation]) => !!relation.target),
      Array.map(([, relation]) => relation.target)
    )
  );

export const circularConnection =
  (tree: TTree) =>
  ({ source, target }: { source: string; target: string }): boolean => {
    const nodesOnPaths = getPaths(tree.nodes[source])(tree).flatMap(
      (path) => path
    );

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths =
  ({ id: startId }: Node.TNode) =>
  (tree: TTree) => {
    const result: string[][] = [];
    let path: string[] = [];

    const visited: Record<string, boolean> = {};
    const adjacencyList = Object.entries(tree.nodes).reduce(
      (acc: Record<string, string[]>, [key, node]) => {
        const relations = node.data.relations;
        if (!acc[key]) acc[key] = [];

        Object.values(relations).forEach((relation) => {
          if (relation.target) {
            if (!acc[relation.target]) {
              acc[relation.target] = [];
            }

            acc[relation.target].push(key);
          }
        });

        return acc;
      },
      {}
    );

    (function depthFirstSearch(id: string) {
      visited[id] = true;
      path.push(id);

      adjacencyList[id].forEach((target) => {
        if (!visited[target]) {
          return depthFirstSearch(tree.nodes[target].id);
        }
      });

      if (path.length > 1) result.push(path);
      path = [startId];
    })(startId);

    return result;
  };
// export const getValidPaths = (node: Node.TNode) => (tree: TTree) => {};

export const getConnectableNodes = (node: Node.TNode) => (tree: TTree) => {
  const nodesOnPath = getPaths(node)(tree).flatMap((path) => path);

  return pipe(
    tree.nodes,
    Record.filter(
      (iteratedNode) =>
        iteratedNode.id !== node.id && !nodesOnPath.includes(iteratedNode.id)
    )
  );
};

// ------------------------------------------------------------------
// Types
export type TNodeConfig = T.TypeOf<typeof NodeConfig>;
export type TNodeTypes = T.TypeOf<typeof NodeTypes>;
export type TPortConfig = T.TypeOf<typeof PortConfig>;
export type TPortTypes = T.TypeOf<typeof PortTypes>;
export type TTree = T.TypeOf<typeof Type>;
