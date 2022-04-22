import { Input, Tree } from "../type-classes";
import { getInput } from "../getters";

export const addInputAnswer =
  (tree: Tree.TTree) => (inputId: string, answer: Input.TAnswer) => {
    const input = getInput(tree)(inputId);

    if (!input) return;

    input.answers.push(answer);
  };
