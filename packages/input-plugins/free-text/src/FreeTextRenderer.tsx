import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { RendererComponentProps } from "@open-decision/input-plugins-helpers";
import { TFreeTextInput } from "./freeTextPlugin";

export function FreeTextForm({
  input,
  css,
  children,
  onSubmit,
}: RendererComponentProps<TFreeTextInput>) {
  const { send, getAnswer, getCurrentNode } = useInterpreter();

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

    const currentNode = getCurrentNode();

    send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditionIds: currentNode?.data.conditions ?? [],
      nodeId: currentNode?.id,
    });

    onSubmit?.(formState.values);
  });

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
      <Form.Field Label={input.label ?? "Eingabe"}>
        <Form.Input name={formState.names[input.id]} />
      </Form.Field>
      {children}
    </Form.Root>
  );
}
