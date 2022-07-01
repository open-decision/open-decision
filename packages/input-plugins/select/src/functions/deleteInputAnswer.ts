import { TTreeClient } from "../selectPlugin";
import { get } from "./get";
// FIXME
export const deleteInputAnswer =
  (treeClient: TTreeClient) => (inputId: string, answerId: string) => {
    const input = get(treeClient)(inputId);

    if (!input) return;

    const answerIndex = input.answers.findIndex(({ id }) => id === answerId);

    input.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    treeClient.conditions.deleteN(
      Object.values(treeClient.condition.compare.getAll() ?? {})
        .filter((condition) => condition.valueId === answerId)
        .map((condition) => condition.id)
    );
  };
