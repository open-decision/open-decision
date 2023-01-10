import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { INodePlugin, NodePlugin } from "@open-decision/tree-type";
import { isEmpty } from "ramda";

export const getNodesByInput =
  <TType extends INodePlugin>(nodePlugin: NodePlugin<TType>) =>
  (inputId: string) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    const nodes = nodePlugin.getAll(treeClient);

    if (!nodes) return undefined;

    const relatedNodes: Record<string, TType> = {};
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
