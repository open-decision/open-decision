import { ODProgrammerError } from "@open-decision/type-classes";
import { INode } from "../plugin";
import { Tree } from "../type-classes";

export const getNodeSingle =
  (tree: Tree.TTree) =>
  <TType extends INode>(id: TType["id"], type?: TType["type"]) => {
    const node = tree.nodes[id];

    if (!node) return undefined;

    if (type && node.type !== type) {
      console.warn(
        new ODProgrammerError({
          code: "INVALID_ENTITY_TYPE",
          message: `You are trying to get a node with a type of ${type}, but the node of id ${id} is of type ${node.type}`,
        })
      );

      return undefined;
    }

    return node as TType;
  };
