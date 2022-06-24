import { TTreeClient } from "@open-decision/type-classes";
import { TAnswer, TSelectInput } from "../types";

export const create =
  (treeClient: TTreeClient) =>
  (data?: { answers?: TAnswer[] }): TSelectInput => {
    const newInput = treeClient.inputs.create();
    return { type: "select", answers: data?.answers ?? [], ...newInput };
  };
