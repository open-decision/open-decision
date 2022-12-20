import { Node, TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";

export const createNodeOfType =
  <TType extends typeof Node.Type>(
    treeClient: TTreeClient,
    Type: Omit<TType, "data">
  ) =>
  <TNode extends Omit<Node.TNode, "id">>(node: TNode) => {
    const newNode = treeClient.nodes.create.node(node);

    const parsedNode = Type.safeParse(newNode);

    if (!parsedNode.success) {
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The condition could not be created. Please check that the data is correct.",
      });
    }

    return parsedNode.data;
  };
