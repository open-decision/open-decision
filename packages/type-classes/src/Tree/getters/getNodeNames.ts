import { filter, map, pipe } from "remeda";
import { Node, Tree } from "../type-classes";

const nodeWithName = (
  node: Node.TNode
): node is Node.TNode & { data: { name: string } } => {
  return typeof node.data.name === "string";
};

export const getNodeNames =
  (tree: Tree.TTree) =>
  (nodeIds?: string[]): { id: string; name: string }[] => {
    if (!tree.nodes) return [];

    return pipe(
      tree.nodes,
      Object.values,
      filter((node) =>
        nodeIds
          ? nodeIds.includes(node.id) && nodeWithName(node)
          : nodeWithName(node)
      ),
      map((node) => ({ id: node.id, name: node.data.name }))
    );
  };
