import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Answers } from "./Answers";
import { TSelectInput } from "../selectPlugin";
import { RendererComponentProps } from "@open-decision/form-element-helpers";

export function AnswersForm({
  input,
  css,
  children,
  onSubmit,
}: RendererComponentProps<TSelectInput>) {
  const { send, getAnswer } = useInterpreter();

  const formState = Form.useFormState({
    defaultValues: { [input.id]: getAnswer(input.id) ?? "" },
  });

  formState.useSubmit(() => {
    for (const inputId in formState.values) {
      const answer = formState.values[inputId];

      send({
        type: "ADD_USER_ANSWER",
        inputId,
        answer,
      });
    }

    send("EVALUATE_NODE_CONDITIONS");

    onSubmit?.(formState.values);
  });

  const options = Object.keys(formState.values);

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
      {options.map((inputId) => (
        <Answers
          name={input.id}
          input={input}
          key={inputId}
          activeValue={formState.values[inputId]}
        />
      ))}
      {children}
    </Form.Root>
  );
}
