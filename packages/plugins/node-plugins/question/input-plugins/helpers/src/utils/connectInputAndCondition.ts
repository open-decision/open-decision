import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";
import { getInput } from "./getInput";

export const connectInputAndCondition =
  (treeClient: TTreeClient) => (conditionId: string, inputId: string) => {
    const condition = treeClient.conditions.get.single(conditionId);
    // We get the input just to validate that it exists.
    getInput(treeClient, Input.Type)(inputId);

    condition.inputId = inputId;
  };
