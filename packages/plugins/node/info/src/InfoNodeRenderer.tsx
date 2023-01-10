import { Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { NodeRenderer } from "@open-decision/plugins-node-helpers";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { InfoNodePlugin } from "./infoNodePlugin";

const InfoNode = new InfoNodePlugin();

export const InfoNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const { treeClient } = useInterpreter();
  const node = InfoNode.getSingle(nodeId)(treeClient);

  const methods = Form.useForm({});
  const { send } = useInterpreter();

  if (node instanceof Error) return null;

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
      <RendererPrimitives.Form
        methods={methods}
        onSubmit={methods.handleSubmit(() => send("EVALUATE_NODE_CONDITIONS"))}
      />
    </RendererPrimitives.Container>
  );
};
