import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { RendererComponentProps } from "@open-decision/form-element-helpers";
import { TTextInput } from "../textPlugin";

export function RendererComponent({
  input,
  css,
  children,
  onSubmit,
}: RendererComponentProps<TTextInput>) {
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

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
      <Form.Field Label={input.data.label ?? "Eingabe"}>
        <Form.Input name={formState.names[input.id]} />
      </Form.Field>
      {children}
    </Form.Root>
  );
}
