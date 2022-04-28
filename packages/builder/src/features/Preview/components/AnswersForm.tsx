import * as React from "react";
import { StyleObject, useForm } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter";
import { SelectAnswers } from "./Answers/SelectAnswers";

type PreviewAnswerFormProps = {
  inputIds: string[];
  css?: StyleObject;
};

export function AnswersForm({ inputIds, css }: PreviewAnswerFormProps) {
  const { send, getInputs, getAnswer, getCurrentNode } = useInterpreter();
  const inputs = getInputs(inputIds);

  const defaultValues = {};

  Object.values(inputs ?? {}).forEach(
    (input) => (defaultValues[input.id] = getAnswer(input.id))
  );

  const [Form] = useForm({
    defaultValues,
  });
  if (!inputs) return null;

  return (
    <Form css={css}>
      {Object.values(inputs).map((input) => {
        return (
          <SelectAnswers
            name={input.id}
            input={input}
            key={input.id}
            onChange={(newValue) => {
              send({
                type: "ADD_USER_ANSWER",
                inputId: input.id,
                answerId: newValue,
              });
              send({
                type: "EVALUATE_NODE_CONDITIONS",
                conditionIds: getCurrentNode()?.data.conditions ?? [],
              });
            }}
          />
        );
      })}
    </Form>
  );
}
