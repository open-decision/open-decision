import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer, RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { DecisionNodePlugin } from "./decisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export const DecisionNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { getAnswers, send, treeClient } = useInterpreter();

  const node = DecisionNode.get.single(nodeId)(treeClient);

  const inputType = useInterpreterTree((treeClient) => {
    if (!node.data.input) return undefined;

    return treeClient.pluginEntity.get.single<typeof DecisionNode.inputType>(
      "inputs",
      node.data.input
    )?.type;
  });

  const answer = DecisionNode.getAnswer(node.id, getAnswers());
  const methods = Form.useForm<{ answer: string }>({
    defaultValues: answer ? { answer: answer.data.value } : {},
  });

  const onSubmit = methods.handleSubmit((values) => {
    const answer = DecisionNode.createVariable(
      node.id,
      values.answer
    )(treeClient);

    console.log(answer);

    if (!answer) return;

    send({
      type: "ADD_USER_ANSWER",
      answer: { [node.id]: answer },
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  if (!inputType || !node.data.input) return null;

  const FormElement = DecisionNode.inputPlugins[inputType].RendererComponent;

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.data.content ? (
          <RichTextRenderer
            content={node.data.content}
            key={node.id}
            className="px-0"
          />
        ) : null}
      </RendererPrimitives.ContentArea>
      <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
        <FormElement inputId={node.data.input} />
      </RendererPrimitives.Form>
    </RendererPrimitives.Container>
  );
};
