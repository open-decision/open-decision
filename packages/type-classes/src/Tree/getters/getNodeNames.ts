import { filter, map, pipe } from "remeda";
import { Node, Tree } from "../type-classes";

const nodeWithName = (
  node: Node.TNode
): node is Node.TNode & { data: { name: string } } => {
  return typeof node.data.name === "string";
};

export const getNodeNames =
  (nodes: Tree.TTree["nodes"]) =>
  (ids?: string[]): { id: string; name: string }[] => {
    if (!nodes) return [];

    return pipe(
      nodes,
      Object.values,
      filter((node) =>
        ids ? ids.includes(node.id) && nodeWithName(node) : nodeWithName(node)
      ),
      map((node) => ({ id: node.id, name: node.data.name }))
    );
  };
