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

export const getInputsWithAnswers =
  (tree: Tree.TTree) =>
  (inputIds: string[]): Input.TInputsRecord | undefined => {
    const inputs = getInputs(tree)(inputIds);

    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if (input.answers?.length > 0) previousValue[input.id] = input;

        return previousValue;
      },
      {} as Input.TInputsRecord
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  };
