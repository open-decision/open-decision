import {
  NodePlugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

export const getInputByNode =
  <TType extends IInputPlugin>(nodePlugin: NodePlugin) =>
  (nodeId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    const node = nodePlugin.getSingle(nodeId)(treeClient);

    if (node instanceof Error) throw node;
    if (!node.data.input) return undefined;

    return treeClient.pluginEntity.get.single<TType>("inputs", node.data.input);
  };
