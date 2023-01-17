import { Form } from "@open-decision/design-system";
import {
  useInterpreter,
  useInterpreterTree,
} from "@open-decision/interpreter-react";
import { TNodeRenderer, TInputId } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { mapValues } from "remeda";
import { TFormNodeInput } from "./FormNodeInputs";
import { FormNodePlugin, IFormNode } from "./FormNodePlugin";

const FormNode = new FormNodePlugin();

export const FormNodeRenderer: TNodeRenderer = ({ nodeId, ...props }) => {
  const node = useInterpreterTree(FormNode.getSingle(nodeId));
  const inputs = useInterpreterTree((treeClient) => {
    if (!node || !node.inputs) return undefined;

    return treeClient.pluginEntity.get.collection<TFormNodeInput>(
      "inputs",
      node.inputs
    );
  });

  if (!node) return null;

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
        {inputs ? <FormNodeForm inputs={inputs} node={node} /> : null}
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};

type FormNodeFormProps = {
  inputs: Record<string, TFormNodeInput>;
  node: IFormNode;
};

const FormNodeForm = ({ inputs, node }: FormNodeFormProps) => {
  const { send, getVariable, treeClient } = useInterpreter();

  const answer = getVariable(node.id);

  const methods = Form.useForm<Record<TInputId, string | string[]>>({
    defaultValues: mapValues(answer?.value ?? {}, (value) => value?.value),
  });

  const onSubmit = methods.handleSubmit((values) => {
    const variable = FormNode.createVariable(node.id, values)(treeClient);

    if (!variable) return;

    send({
      type: "ADD_USER_ANSWER",
      variable,
    });

    send("EVALUATE_NODE_CONDITIONS");
  });

  return (
    <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
      {Object.values(inputs ?? {}).map((input) => {
        const FormElement = FormNode.inputPlugins.Renderer[input.type];

        if (!FormElement) return null;

        return <FormElement key={input.id} inputId={input.id} />;
      })}
    </RendererPrimitives.Form>
  );
};
