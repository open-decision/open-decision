import { Input, Tree } from "../type-classes";

export const updateInput =
  (tree: Tree.TTree) =>
  <TInput extends Input.TBaseInput>(inputId: string, newInput: TInput) => {
    const inputs = tree.inputs;

    if (!inputs) return;

    inputs[inputId] = newInput;

    console.log(inputs);
  };
