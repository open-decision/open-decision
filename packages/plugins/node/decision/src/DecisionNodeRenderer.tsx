import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer, TInputId } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { TDecisionNodeInputs } from "./createInputPlugins";
import { DecisionNodePlugin, IDecisionNode } from "./DecisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export const DecisionNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const node = useInterpreterTree((treeClient) =>
    DecisionNode.getSingle(nodeId)(treeClient)
  );
  const input = useInterpreterTree((treeClient) =>
    treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      node?.input
    )
  );

  if (!node) return null;

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
        {input ? <DecisionNodeForm node={node} input={input} /> : null}
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};

type DecisionNodeFormProps = {
  input: TDecisionNodeInputs;
  node: IDecisionNode;
};

const DecisionNodeForm = ({ input, node }: DecisionNodeFormProps) => {
  const { getAnswers, send, treeClient } = useInterpreter();

  const answer = DecisionNode.getVariable(node.id, getAnswers())(treeClient);

  const methods = Form.useForm<{ [x: TInputId]: string }>({
    defaultValues: answer ? { [input.id]: answer?.value } : {},
  });

  const onSubmit = methods.handleSubmit((values) => {
    const variable = DecisionNode.createVariable(
      node.id,
      values[input.id]
    )(treeClient);

    if (!variable) return;

    send({
      type: "ADD_USER_ANSWER",
      answer: variable,
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  const FormElement = DecisionNode.inputPlugins.Renderer[input.type];

  if (!FormElement) return null;

  return (
    <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
      <FormElement inputId={input.id} />
    </RendererPrimitives.Form>
  );
};
