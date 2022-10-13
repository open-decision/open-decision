import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const getInputs =
  <TType extends z.ZodTypeAny>(treeClient: TTreeClient, type: TType) =>
  (inputIds: string[]) => {
    return treeClient.pluginEntity.get.collection("inputs", inputIds, type);
  };
