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
  });

  formState.useSubmit(() => {
    for (const inputId in formState.values) {
      const answer = formState.values[inputId];

      send({
        type: "ADD_USER_ANSWER",
        inputId,
        answerId: answer,
      });
    }

    send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditionIds: getCurrentNode()?.data.conditions ?? [],
    });
  });

  const options = Object.keys(defaultValues);

  return (
    <Form.Root state={formState} css={css}>
      {inputs ? (
        <>
          {options.map((inputId) => (
            <Answers
              name={inputId}
              input={inputs[inputId]}
              key={inputId}
              activeValue={formState.values[inputId]}
            />
          ))}
          <Form.Submit
            css={{
              alignSelf: "end",
              marginTop: "$2",
              fontWeight: "$large-text",
            }}
          >
            Weiter
          </Form.Submit>
        </>
      ) : null}
    </Form.Root>
  );
}
