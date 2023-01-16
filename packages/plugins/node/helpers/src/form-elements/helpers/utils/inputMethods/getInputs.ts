import { TTreeClient, TReadOnlyTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, TInputId } from "../../InputPlugin";

export const getInputs =
  <TType extends IInputPlugin>() =>
  (inputIds: TInputId[]) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    return treeClient.pluginEntity.get.collection<TType>("inputs", inputIds);
  };
