import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { RendererComponentProps } from "@open-decision/input-plugins-helpers";
import { TFreeTextInput } from "./freeTextPlugin";
import { useTreeClient } from "@open-decision/tree-sync";
import { InterpreterError } from "@open-decision/type-classes";

export function FreeTextForm({
  input,
  css,
  children,
  onSubmit,
}: RendererComponentProps<TFreeTextInput>) {
  const { send, getAnswer, getCurrentNode } = useInterpreter();
  const treeClient = useTreeClient();

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
    const conditions = treeClient.conditions.get.byNode(currentNode.id);

    if (!conditions)
      throw new InterpreterError({
        code: "NO_TRUTHY_CONDITION",
        message: `The node with id ${currentNode.id} has no conditions`,
      });

    send({
      type: "EVALUATE_NODE_CONDITIONS",
      conditions,
      nodeId: currentNode?.id,
    });

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
