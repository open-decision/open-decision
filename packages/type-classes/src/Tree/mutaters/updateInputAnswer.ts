import { Tree } from "../type-classes";
import { getInput } from "../getters";

export const updateInputAnswer =
  (tree: Tree.TTree) =>
  (inputId: string, answerId: string, newAnswer: string) => {
    const input = getInput(tree)(inputId);
    if (!input) return;

    const answer = input.answers.find(({ id }) => id === answerId);

    if (!answer) return;

    answer.text = newAnswer;
  };
