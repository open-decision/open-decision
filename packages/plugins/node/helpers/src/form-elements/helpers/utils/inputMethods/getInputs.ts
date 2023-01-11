import { TTreeClient, TReadOnlyTreeClient } from "@open-decision/tree-type";
import { TInputPlugin } from "../../InputPlugin";

export const getInputs =
  <TType extends TInputPlugin>() =>
  (inputIds: string[]) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    return treeClient.pluginEntity.get.collection<TType>("inputs", inputIds);
  };
