import { TTreeClient } from "@open-decision/tree-type";

export const disconnectInputAndCondition =
  (treeClient: TTreeClient) => (conditionId: string) => {
    const condition = treeClient.conditions.get.single(conditionId);

    delete condition.inputId;
  };
