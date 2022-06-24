import { TTreeClient } from "@open-decision/type-classes";
import { get } from "./get";

export const deleteInputAnswer =
  (treeClient: TTreeClient) => (inputId: string, answerId: string) => {
    const input = get(treeClient)(inputId);

    if (input instanceof Error) return;

    const answerIndex = input.answers.findIndex(({ id }) => id === answerId);

    input.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    treeClient.conditions.deleteN(
      Object.values(tree.conditions ?? {})
        .filter((condition) => condition.answerId === answerId)
        .map((condition) => condition.id)
    );
  };
