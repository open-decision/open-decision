import * as BuilderNode from "../Node/BuilderNode";
import * as PublicNode from "../Node/PublicNode";
import * as BuilderTree from "../Tree/BuilderTree";
import * as PublicTree from "../Tree/PublicTree";
import { pipe, flatMap, filter, map, reduce, uniq } from "remeda";
import { values } from "ramda";
import { createAdjacencyList, depthFirstSearch } from "./utils";
import stringify from "json-stable-stringify";
import * as murmur from "murmurhash-js";

type Nodes =
  | PublicTree.TTree["treeData"]["nodes"]
  | BuilderTree.TTree["treeData"]["nodes"];

// ------------------------------------------------------------------
// Methods
/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents =
  (nodeId: string) =>
  (tree: PublicTree.TTree | BuilderTree.TTree): string[] =>
    pipe(
      // We operate on the nodes of the tree.
      tree.treeData.nodes,
      values,
      // We flatMap to remove an unnecessary level of array nesting.
      flatMap((node) =>
        pipe(
          // We check all node relations.
          node.relations,
          values,
          // We reduce here, because we only want to include the valid parents and no undefined in the resulting array.
          reduce((acc: string[], relation) => {
            // Check whether the target is the initially provided nodeId. If true merge the existing accumulated array with the
            // node id of the lopped over node id.
            if (relation.target === nodeId) return [...acc, node.id];

            return acc;
          }, [])
        )
      ),
      // Remove all repeating parentNodeIds.
      uniq()
    );

/**
 * Get the immediate Children of the node with the provided id.
 */
export const getChildren = (nodeId: string) => (nodes: Nodes) =>
  pipe(
    // Get the node from the tree
    nodes[nodeId].relations,
    values,
    // Filter out relations without targets
    filter((relation) => Boolean(relation.target)),
    // Return an array of the target ids
    map((relation) => relation.target)
  );

export const circularConnection =
  ({ source, target }: { source: string; target: string }) =>
  (nodes: Nodes): boolean => {
    const nodesOnPaths = getPaths(source)(nodes).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };

export const getPaths = (nodeId: string) => (nodes: Nodes) => {
  const adjacencyList = createAdjacencyList(nodes);

  return depthFirstSearch(nodeId, adjacencyList);
};

export const getConnectableNodes =
  <TNode extends PublicNode.TNode | BuilderNode.TNode>(node: TNode) =>
  (nodes: Nodes): TNode[] => {
    const nodesOnPath = getPaths(node.id)(nodes).flatMap((path) => path);
    const nodesChildren = getChildren(node.id)(nodes);

    return pipe(
      nodes,
      Object.values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== node.id &&
          !nodesOnPath.includes(iteratedNode.id) &&
          !nodesChildren.includes(iteratedNode.id)
      )
    );
  };

export const getTreeHash = (tree: Omit<PublicTree.TTree, "checksum">) => {
  // Use "json-stable-stringify" to get a deterministic JSON string
  // then hash using murmur3 as hash-algo, as it's lightweight and small, seed is 0
  return murmur.murmur3(stringify({ id: tree.id, treeData: tree.treeData }), 0);
};

type IsUniqueNode =
  | { name?: string; id: string }
  | { name: string; id?: string };

export const isUnique =
  (node: IsUniqueNode) => (treeData: BuilderTree.TTree["treeData"]) => {
    const { nodes } = treeData;

    return !Object.values(nodes).some(
      (existingNode) =>
        node?.id === existingNode.id || node?.name?.trim() === existingNode.name
    );
  };
