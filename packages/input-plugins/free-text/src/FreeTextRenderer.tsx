import { StyleObject, Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { TFreeTextInput } from "./freeTextPlugin";

type PreviewAnswerFormProps = {
  input: TFreeTextInput;
  css?: StyleObject;
};

export function FreeTextForm({ input, css }: PreviewAnswerFormProps) {
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
  });

  return (
    <Form.Root state={formState} css={css} resetOnSubmit={false}>
      Free Text Input
    </Form.Root>
  );
}
