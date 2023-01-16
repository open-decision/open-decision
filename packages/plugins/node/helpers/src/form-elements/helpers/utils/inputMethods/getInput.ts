import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

export const getInput =
  <TType extends IInputPlugin>() =>
  (inputId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    return treeClient.pluginEntity.get.single<TType>("inputs", inputId);
  };
