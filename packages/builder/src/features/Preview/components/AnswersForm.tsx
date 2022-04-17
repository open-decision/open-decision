import * as React from "react";
import { StyleObject, useForm } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter";
import { Navigation } from "./Navigation";
import { SelectAnswers } from "./Answers/SelectAnswers";

type PreviewAnswerFormProps = {
  inputIds: string[];
  css?: StyleObject;
};

export function AnswersForm({ inputIds, css }: PreviewAnswerFormProps) {
  const { interpreter, getInputs } = useInterpreter();
  const inputs = getInputs(inputIds);

  const [Form] = useForm({});
  if (!inputs) return null;

  return (
    <Form css={css}>
      {Object.values(inputs).map((input) => {
        return (
          <SelectAnswers
            input={input}
            key={input.id}
            onChange={(newValue) => {
              interpreter.addUserAnswer(input.id, newValue);
              interpreter.evaluateNodeConditions(
                interpreter.getCurrentNode()?.data.conditions ?? []
              );
            }}
          />
        );
      })}
    </Form>
  );
}
