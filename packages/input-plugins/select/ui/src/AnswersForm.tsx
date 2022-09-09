import { StyleObject, Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Answers } from "./Answers";
import { mapValues } from "remeda";
import { TSelectInput } from "@open-decision/select-input-plugin";

type PreviewAnswerFormProps = {
  inputs: Record<string, TSelectInput>;
  css?: StyleObject;
  onSubmit: (values: Record<string, string>) => void;
};

export function AnswersForm({ inputs, css }: PreviewAnswerFormProps) {
  const { send, getAnswer, getCurrentNode } = useInterpreter();

  const formState = Form.useFormState({
    defaultValues: mapValues(inputs, (input) => getAnswer(input.id) ?? ""),
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

  const options = Object.keys(formState.values);

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
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
