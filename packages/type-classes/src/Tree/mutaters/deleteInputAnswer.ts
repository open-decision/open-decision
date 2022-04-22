import { Tree } from "../type-classes";
import { getInput } from "../getters";
import { deleteConditions } from "./deleteConditions";

export const deleteInputAnswer =
  (tree: Tree.TTree) => (inputId: string, answerId: string) => {
    const input = getInput(tree)(inputId);

    if (!input) return;

    const answerIndex = input.answers.findIndex(({ id }) => id === answerId);

    input.answers.splice(answerIndex, 1);

    // When an Input is deleted all conditions using it need to be removed.
    deleteConditions(tree)(
      Object.values(tree.conditions ?? {})
        .filter((condition) => condition.answerId === answerId)
        .map((condition) => condition.id)
    );
  };
