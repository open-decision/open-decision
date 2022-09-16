import { Input, Tree } from "../type-classes";

export const updateInput =
  (tree: Tree.TTree) =>
  <TInput extends Input.TBaseInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) => {
    const inputs = tree.inputs;

    if (!inputs) return;

    inputs[inputId] = { id: inputId, ...newInput };

    console.log(inputs);
  };
