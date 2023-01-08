import { InputWithAnswers } from "./sharedTypes";
import { z } from "zod";

export const getInputsWithAnswers =
  <TType extends InputWithAnswers>(_Type: TType) =>
  (inputs: z.infer<TType>[]): Record<string, z.infer<TType>> | undefined => {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if ((input.data.answers?.length ?? 0) > 0)
          previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, z.infer<TType>>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  };
