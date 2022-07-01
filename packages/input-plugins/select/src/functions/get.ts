import { TTreeClient } from "@open-decision/type-classes";
import { selectType, TSelectInput } from "../selectPlugin";

export const get = (treeClient: TTreeClient) => (id: string) => {
  const input = treeClient.inputs.get(id);

  const parsedInput = selectType.validate(input);

  if (!parsedInput.success) return undefined;

  return parsedInput.data;
};

export const getInputsWithAnswers = (
  inputs: TSelectInput[]
): Record<string, TSelectInput> | undefined => {
  if (!inputs) return undefined;

  const filteredInputs = Object.values(inputs).reduce(
    function filterInputsWithoutAnswer(previousValue, input) {
      if (input.answers?.length > 0) previousValue[input.id] = input;

      return previousValue;
    },
    {} as Record<string, TSelectInput>
  );

  if (Object.values(filteredInputs).length === 0) return undefined;

  return filteredInputs;
};
