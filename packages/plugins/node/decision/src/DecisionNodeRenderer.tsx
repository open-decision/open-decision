import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer, TInputId } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { TDecisionNodeInputs } from "./createInputPlugins";
import { DecisionNodePlugin } from "./DecisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export const DecisionNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { getAnswers, send, treeClient } = useInterpreter();

  const node = DecisionNode.getSingle(nodeId)(treeClient);

  const inputType = useInterpreterTree((treeClient) => {
    if (!node || !node.input) return undefined;

    const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      node.input
    );

    if (!input) return undefined;
    return input.type;
  });

  const answer = !node
    ? undefined
    : DecisionNode.getVariable(node.id, getAnswers());

  const methods = Form.useForm<{ [x: TInputId]: string }>({
    defaultValues:
      node && answer && node.input ? { [node.input]: answer?.value } : {},
  });

  const onSubmit = methods.handleSubmit((values) => {
    if (!node || !node.input) return;

    const variable = DecisionNode.createVariable(
      node.id,
      values[node.input]
    )(treeClient);

    if (!variable || variable instanceof Error) return;

    send({
      type: "ADD_USER_ANSWER",
      answer: variable,
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  if (!node || !inputType || !node.input) return null;

  const FormElement = DecisionNode.inputPlugins.Renderer[inputType];

  if (!FormElement) return null;

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.content ? (
          <RichTextRenderer
            content={node.content}
            key={node.id}
            className="px-0"
          />
        ) : null}
        <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
          <FormElement inputId={node.input} />
        </RendererPrimitives.Form>
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
