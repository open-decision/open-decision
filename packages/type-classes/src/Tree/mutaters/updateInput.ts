import { getInputs } from "../getters";
import { Input, Tree } from "../type-classes";

export const updateInput =
  (tree: Tree.TTree) =>
  <TInput extends Input.TBaseInput>(inputId: string, newInput: TInput) => {
    const inputs = getInputs(tree)([inputId]);

    if (!inputs) return;
    console.log(inputs);

    inputs[inputId] = newInput;
  };
