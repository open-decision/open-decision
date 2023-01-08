import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";
import { NodePlugin } from "../../../basePlugin";
import { z } from "zod";

export const getInputByNode =
  <
    TTypeName extends string,
    TData extends z.AnyZodObject,
    TInputType extends ReturnType<typeof Input.Type<TTypeName, TData>>
  >(
    nodePlugin: NodePlugin
  ) =>
  (nodeId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    const node = nodePlugin.get.single(nodeId)(treeClient);

    if (node instanceof Error) throw node;
    if (!node.data.input) return undefined;

    return treeClient.pluginEntity.get.single<TInputType>(
      "inputs",
      node.data.input
    );
  };
