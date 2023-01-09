import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { NodePlugin } from "../../../../basePlugin";
import { z } from "zod";
import { isEmpty } from "ramda";

export const getNodesByInput =
  (nodePlugin: NodePlugin) =>
  (inputId: string) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    type TNode = z.infer<typeof nodePlugin.Type>;
    const nodes = nodePlugin.get.collection()(treeClient);

    if (!nodes) return undefined;

    const relatedNodes: Record<string, TNode> = {};
    for (const key in nodes) {
      const node = nodes[key];

      if (node.data.input === inputId) {
        relatedNodes[key] = node;
      }
    }

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (isEmpty(relatedNodes)) return undefined;

    return relatedNodes;
  };
