import { TTreeClient, TReadOnlyTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const getInputs =
  <TType extends z.ZodType>(Type: TType) =>
  (inputIds: string[]) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    return treeClient.pluginEntity.get.collection<typeof Type>(
      "inputs",
      inputIds
    );
  };
