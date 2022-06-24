import { TTreeClient } from "@open-decision/type-classes";
import {
  isCompareCondition,
  TCompareCondition,
} from "packages/condition-plugins/compare/src/types";
import { selectPlugin } from "../selectPlugin";

export const deleteAnswer =
  (treeClient: TTreeClient) => (inputId: string, answerId: string) => {
    const input = selectPlugin(treeClient).input.select.get(inputId);

    if (input instanceof Error) return;

    const answerIndex = input.answers.findIndex(({ id }) => id === answerId);

    input.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    treeClient.conditions.deleteN(
      Object.values(treeClient.conditions.getAll() ?? {})
        .filter<TCompareCondition>(isCompareCondition)
        .filter((condition) => condition.valueId === answerId)
        .map((condition) => condition.id)
    );
  };
