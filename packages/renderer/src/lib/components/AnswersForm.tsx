import * as React from "react";
import { StyleObject, Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Answers } from "./Answers/Answers";
import { mapValues } from "remeda";
import { Input } from "@open-decision/type-classes";

type PreviewAnswerFormProps = {
  inputs: Input.TInputsRecord;
  css?: StyleObject;
};

export function AnswersForm({ inputs, css }: PreviewAnswerFormProps) {
  const { send, getAnswer, getCurrentNode } = useInterpreter();

  const defaultValues = mapValues(inputs, (input) => getAnswer(input.id) ?? "");

  const formState = Form.useFormState({
    defaultValues,
    setValues(values: Record<string, string>) {
      for (const inputId in values) {
        const answer = values[inputId];

        send({
          type: "ADD_USER_ANSWER",
          inputId,
          answerId: answer,
        });
      }
    },
  });

  formState.useSubmit(() => {
    send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditionIds: getCurrentNode()?.data.conditions ?? [],
    });
  });

  if (!inputs) return null;

  return (
    <Form.Root state={formState} css={css}>
      {Object.keys(defaultValues).map((inputId) => (
        <Answers
          name={inputId}
          input={inputs[inputId]}
          key={inputId}
          activeValue={formState.values[inputId]}
        />
      ))}
      <Form.Submit css={{ alignSelf: "end", marginTop: "$2" }}>
        Weiter
      </Form.Submit>
    </Form.Root>
  );
}
