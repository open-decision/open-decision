import { Node, Tree } from "../type-classes";
import { v4 as uuid } from "uuid";
import { getNodeAll } from "../getters";
import { INodePlugin } from "../plugin";

export type NewNodeData = Partial<Omit<Node.TNode, "id">>;

/**
 * You almost certainly do not want to use this directly, but use a plugin instead.
 * This is a low-level function that is used by plugins to create a new node.
 * @param data must include the base properties of a node
 * @param type defaults to question
 * @returns the data merged with a unique id
 */
export const createNode =
  (tree: Tree.TTree) =>
  <TNodeType extends Node.TNode>({
    position = { x: 0, y: 0 },
    type = "placeholder",
    name,
  }: Partial<Omit<TNodeType, "id">>) => {
    const fallbackName = `Knoten ${
      Object.keys(getNodeAll(tree)() ?? {}).length + 1
    }`;

    return {
      id: `nodes_${uuid()}`,
      position,
      type,
      name: name ?? fallbackName,
    } satisfies INodePlugin;
  };
