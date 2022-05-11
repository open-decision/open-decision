import * as React from "react";
import { StyleObject, Form } from "@open-decision/design-system";
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

  const formState = Form.useFormState({
    defaultValues,
  });
  if (!inputs) return null;

  return (
    <Form.Root state={formState} css={css}>
      {Object.values(inputs).map((input) => {
        return (
          <Form.CustomControl
            as={SelectAnswers}
            name={input.id}
            input={input}
            key={input.id}
            onChange={(value) => {
              send({
                type: "ADD_USER_ANSWER",
                inputId: input.id,
                answerId: value,
              });

              send({
                type: "EVALUATE_NODE_CONDITIONS",
                conditionIds: getCurrentNode()?.data.conditions ?? [],
              });
            }}
          />
        );
      })}
    </Form.Root>
  );
}
