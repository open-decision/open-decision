import { pick } from "remeda";
import { Input, Tree } from "../type-classes";

export const getInput = (tree: Tree.TTree) => (inputId: string) => {
  return tree.inputs?.[inputId];
};

export const getInputs =
  (tree: Tree.TTree) =>
  (inputIds: string[]): Input.TInputsRecord | undefined => {
    if (!tree.inputs) return undefined;

    const inputs = pick(tree.inputs, inputIds);
    if (!inputs) return undefined;

    return inputs;
  };
