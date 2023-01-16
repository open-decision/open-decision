import { TTreeClient, TReadOnlyTreeClient } from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

export const getInputs =
  <TType extends IInputPlugin>() =>
  (inputIds: string[]) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    return treeClient.pluginEntity.get.collection<TType>("inputs", inputIds);
  };
