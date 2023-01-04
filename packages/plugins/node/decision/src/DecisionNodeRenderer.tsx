import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { DecisionNodePlugin } from "./decisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export const DecisionNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { getAnswers, send, treeClient, state } = useInterpreter();

  const node = DecisionNode.get.single(nodeId)(treeClient);
  const isError = node instanceof Error;

  const inputType = useInterpreterTree((treeClient) => {
    if (isError || !node.data.input) return undefined;

    return treeClient.pluginEntity.get.single<typeof DecisionNode.inputType>(
      "inputs",
      node.data.input
    )?.type;
  });

  const answer = isError
    ? undefined
    : DecisionNode.getAnswer(node.id, getAnswers());

  const methods = Form.useForm<{ [x: string]: string }>({
    defaultValues:
      !isError && answer && node.data.input
        ? { [node.data.input]: answer.data.value }
        : {},
  });

  const onSubmit = methods.handleSubmit((values) => {
    if (isError || !node.data.input) return;

    const answer = DecisionNode.createVariable(
      node.id,
      values[node.data.input]
    )(treeClient);

    if (!answer) return;

    send({
      type: "ADD_USER_ANSWER",
      answer: { [node.id]: answer },
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  if (isError || !inputType || !node.data.input) return null;

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
        <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
          <FormElement inputId={node.data.input} />
        </RendererPrimitives.Form>
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
