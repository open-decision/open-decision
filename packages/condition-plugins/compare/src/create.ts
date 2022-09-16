import { TTreeClient } from "@open-decision/type-classes";
import { TCompareCondition } from "./types";

type Data = { inputId: string; valueId: string };

export const create =
  (treeClient: TTreeClient) =>
  ({ inputId, valueId }: Data): TCompareCondition => {
    const newCondition = treeClient.conditions.create();
    return { type: "compare", inputId, valueId, ...newCondition };
  };
