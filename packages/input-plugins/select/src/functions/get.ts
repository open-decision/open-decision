import { ODError, TTreeClient } from "@open-decision/type-classes";
import { TSelectInput, Type, type } from "../types";

export const get =
  (treeClient: TTreeClient) =>
  (id: string): TSelectInput | ODError => {
    const input = treeClient.inputs.get(id);

    const parsedInput = Type.safeParse(input);

    if (!parsedInput.success)
      return new ODError({
        code: "GENERIC_ERROR",
        message: `The requested input has been found but is not of type ${type}`,
      });

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
