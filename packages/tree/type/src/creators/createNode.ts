import { Node, Tree } from "../type-classes";
import { getNodeAll } from "../getters";
import { INode } from "../plugin";

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
  <TNodeType extends INode = INode>({
    position = { x: 0, y: 0 },
    type,
    name,
    ...data
  }: Omit<TNodeType, "id" | "name" | "position"> &
    Partial<Pick<TNodeType, "name" | "position">>) => {
    const fallbackName = `Knoten ${
      Object.keys(getNodeAll(tree)() ?? {}).length + 1
    }`;

    return {
      id: `node_${crypto.randomUUID()}`,
      position,
      type,
      name: name ?? fallbackName,
      ...data,
    } satisfies INode;
  };
