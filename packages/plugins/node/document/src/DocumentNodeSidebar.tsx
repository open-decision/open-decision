import { Form } from "@open-decision/design-system";
import { TNodeSidebar, NodeSidebar } from "@open-decision/node-editor";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { DocumentNodePlugin } from "./documentNodePlugin";

const DocumentNode = new DocumentNodePlugin();

export const DocumentNodeSidebar: TNodeSidebar = ({
  nodeId,
  edgePlugins,
  nodePlugins,
}) => {
  const treeClient = useTreeClient();
  const t = useTranslations("builder.nodeEditingSidebar");

  const node = useTree((treeClient) => {
    return DocumentNode.get.single(nodeId)(treeClient);
  });

  const methods = Form.useForm({
    defaultValues:
      node instanceof Error
        ? {}
        : {
            templateUuid: node.data.templateUuid ?? "",
          },
  });

  if (node instanceof Error) return null;

  return (
    <NodeSidebar
      nodeId={nodeId}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
    >
      <section>
        <RichTextEditor
          maxHeight={400}
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            DocumentNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.data.content}
          Label={t("richTextEditor.label")}
        />
      </section>
      <Form.Root methods={methods}>
        <Form.Field Label="Template Uuid">
          <Form.Input
            {...methods.register("templateUuid", {
              onChange: (event) =>
                DocumentNode.updateTemplateUuid(
                  nodeId,
                  event.target.value
                )(treeClient),
            })}
          />
        </Form.Field>
      </Form.Root>
    </NodeSidebar>
  );
};
