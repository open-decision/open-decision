import { Input, Tree } from "../type-classes";
import { getInput } from "../getters";

export const updateInputAnswerOrder =
  (tree: Tree.TTree) => (inputId: string, newAnswers: Input.TAnswer[]) => {
    const input = getInput(tree)(inputId);
    if (!input) return;

    input.answers = newAnswers;
  };
