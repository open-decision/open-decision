import {
  NodePlugin,
  TNodeId,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";
import { NodeWithInput } from "./sharedTypes";

export const getInputByNode =
  <TNodeType extends NodeWithInput, TInputType extends IInputPlugin>(
    nodePlugin: NodePlugin<TNodeType>
  ) =>
  (nodeId: TNodeId) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    const node = nodePlugin.getSingle(nodeId)(treeClient);

    if (!node || !node.input) return undefined;

    return treeClient.pluginEntity.get.single<TInputType>("inputs", node.input);
  };
