import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer, TInputId } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { mapValues } from "remeda";
import { TFormNodeInput } from "./FormNodeInputs";
import { FormNodePlugin } from "./FormNodePlugin";

const FormNode = new FormNodePlugin();

export const FormNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { send, getVariables: getAnswers, treeClient } = useInterpreter();

  const node = FormNode.getSingle(nodeId)(treeClient);

  const inputs = useInterpreterTree((treeClient) => {
    if (!node || !node.inputs) return undefined;

    return treeClient.pluginEntity.get.collection<TFormNodeInput>(
      "inputs",
      node.inputs
    );
  });

  const answer = !node
    ? undefined
    : FormNode.getVariable(node.id, getAnswers());

  const methods = Form.useForm<Record<TInputId, string | string[]>>({
    defaultValues: mapValues(answer?.value ?? {}, (value) => value?.value),
  });

  if (!node) return null;

  const onSubmit = methods.handleSubmit((values) => {
    const variable = FormNode.createVariable(node.id, values)(treeClient);

    if (!variable) return;

    send({
      type: "ADD_USER_ANSWER",
      answer: variable,
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.content ? (
          <RichTextRenderer content={node.content} key={node.id} />
        ) : null}
        <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
          {Object.values(inputs ?? {}).map((input) => {
            const FormElement =
              FormNode.inputPlugins[input.type].RendererComponent;

            if (!FormElement) return null;

            return <FormElement key={input.id} inputId={input.id} />;
          })}
        </RendererPrimitives.Form>
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
