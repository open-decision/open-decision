import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { NodeRenderer } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { mapValues } from "remeda";
import { FormNodePlugin } from "./formNodePlugin";

const FormNode = new FormNodePlugin();

export const FormNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { send, getAnswers, treeClient } = useInterpreter();

  const node = FormNode.get.single(nodeId)(treeClient);

  const inputs = useInterpreterTree((treeClient) => {
    if (node instanceof Error || !node.data.inputs) return undefined;

    return treeClient.pluginEntity.get.collection<typeof FormNode.inputType>(
      "inputs",
      node.data.inputs
    );
  });

  const answer =
    node instanceof Error ? {} : FormNode.getAnswer(node.id, getAnswers());

  const methods = Form.useForm({
    defaultValues: mapValues(answer ?? {}, (value) => value?.data.value),
  });

  if (node instanceof Error) return null;

  const onSubmit = methods.handleSubmit((values) => {
    const answers = FormNode.createVariable(values)(treeClient);

    send({
      type: "ADD_USER_ANSWER",
      answer: { [node.id]: { type: "form", answers } },
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
        {node.data.content ? (
          <RichTextRenderer content={node.data.content} key={node.id} />
        ) : null}
        <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
          {Object.values(inputs ?? {}).map((input) => {
            const FormElement =
              FormNode.inputPlugins[input.type].RendererComponent;

            return <FormElement key={input.id} inputId={input.id} />;
          })}
        </RendererPrimitives.Form>
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
