import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const getInput =
  <TType extends z.ZodType>(inputType: TType) =>
  (inputId: string) =>
  (treeClient: TReadOnlyTreeClient | TTreeClient) => {
    return treeClient.pluginEntity.get.single<typeof inputType>(
      "inputs",
      inputId
    );
  };
