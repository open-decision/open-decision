import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, TInputId } from "../../InputPlugin";

export const getInput =
  <TType extends IInputPlugin>() =>
  (inputId: TInputId) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    return treeClient.pluginEntity.get.single<TType>("inputs", inputId);
  };
