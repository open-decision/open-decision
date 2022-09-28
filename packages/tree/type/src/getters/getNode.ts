import { ODProgrammerError } from "@open-decision/type-classes";
import { isEmpty } from "ramda";
import { pick } from "remeda";
import { Tree } from "../type-classes";

/**
 * Returns a single node from the tree.
 * @throws {ODProgrammerError} if the node does not exist
 */
export const getNode =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeId: string) => {
    const node = tree.nodes?.[nodeId];

    if (!node)
      throw new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: `The node of id ${nodeId} could not be found. Please check that the id is correct.
        Is the passed id actually a valid node id?`,
      });

    return node;
  };

export const getNodes =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeIds?: string[]): TTree["nodes"] | undefined => {
    if (!tree.nodes) return undefined;
    if (!nodeIds) return tree.nodes;

    const nodes = pick(tree.nodes, nodeIds);
    if (!nodes || isEmpty(nodes)) return undefined;

    return nodes;
  };
