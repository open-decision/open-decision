import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { NodePlugin } from "../../../../basePlugin";

export const getInputByNode =
  <TType extends string, TData extends z.ZodType>(
    nodePlugin: NodePlugin<TData, TType>
  ) =>
  (nodeId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    const node = nodePlugin.get.single(nodeId)(treeClient);

    if (node instanceof Error) throw node;
    if (!node.data.input) return undefined;

    return treeClient.pluginEntity.get.single<typeof nodePlugin.Type>(
      "inputs",
      node.data.input
    );
  };
