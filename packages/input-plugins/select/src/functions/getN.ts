import { TTreeClient } from "@open-decision/type-classes";
import { Type } from "../types";
import { z } from "zod";

export const getN = (treeClient: TTreeClient) => (inputIds: string[]) => {
  const inputs = treeClient.inputs.getN(inputIds);

  const parsedInput = z.record(Type).safeParse(inputs);

  if (!parsedInput.success) return undefined;

  return parsedInput.data;
};
