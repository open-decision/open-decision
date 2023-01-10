import { InputWithAnswers } from "./sharedTypes";

export const getInputsWithAnswers =
  <TType extends InputWithAnswers>() =>
  (inputs: TType[]): Record<string, TType> | undefined => {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if ((input.data.answers?.length ?? 0) > 0)
          previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, TType>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  };
