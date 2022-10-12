import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { Answers } from "./Answers";
import { TSelectInput } from "../selectPlugin";
import { RendererComponentProps } from "@open-decision/input-plugins-helpers";
import { useTreeClient } from "@open-decision/tree-sync";
import { InterpreterError } from "@open-decision/type-classes";

export function AnswersForm({
  input,
  css,
  children,
  onSubmit,
}: RendererComponentProps<TSelectInput>) {
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

    const conditions = treeClient.conditions.get.byInput(input.id);

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
