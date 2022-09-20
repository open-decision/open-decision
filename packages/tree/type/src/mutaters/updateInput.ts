import { Input, Tree } from "../type-classes";

export const updateInput =
  (tree: Tree.TTree) =>
  <TInput extends Input.TInput>(
    inputId: string,
    newInput: Omit<TInput, "id">
  ) => {
    const inputs = tree.inputs;
    if (!inputs) return;

    inputs[inputId] = { ...newInput, id: inputId };
  };
