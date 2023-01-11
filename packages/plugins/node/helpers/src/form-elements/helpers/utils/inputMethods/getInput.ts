import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { TInputPlugin } from "../../InputPlugin";

export const getInput =
  <TType extends TInputPlugin>() =>
  (inputId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    return treeClient.pluginEntity.get.single<TType>("inputs", inputId);
  };
