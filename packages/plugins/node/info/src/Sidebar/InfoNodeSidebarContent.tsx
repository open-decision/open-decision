import { stackClasses, Tabs } from "@open-decision/design-system";
import * as React from "react";
import { Form, Label, TargetSelector } from "@open-decision/design-system";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { InfoNodePlugin } from "../infoNodePlugin";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { RichTextEditor } from "@open-decision/rich-text-editor";

const InfoNode = new InfoNodePlugin();
const DirectEdge = new DirectEdgePlugin();

type Props = {
  nodeId: string;
};

export function InfoNodeSidebarContent({ nodeId }: Props) {
  const treeClient = useTreeClient();
  const edge = useTree(
    (treeClient) =>
      Object.values(
        DirectEdge.get.byNode(nodeId)(treeClient)?.source ?? {}
      )?.[0]
  );

  const t = useTranslations("builder.nodeEditingSidebar");

  const content = useTree((treeClient) => {
    const node = InfoNode.get.single(nodeId)(treeClient);
    return node.data.content;
  });

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );

  const targetNodeName = useTree((treeClient) => {
    return edge?.target
      ? treeClient.nodes.get.single(edge.target).name
      : undefined;
  });

  const methods = Form.useForm({
    defaultValues: {
      target: targetNodeName,
    },
  });

  return (
    <Tabs.Content value="Inhalt" className={stackClasses({}, "gap-4")}>
      <section>
        <RichTextEditor
          maxHeight={400}
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            InfoNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={content}
          Label={(props) => (
            <Label className="m-0 mb-3 block" {...props}>
              {t("richTextEditor.label")}
            </Label>
          )}
        />
      </section>
      <Form.Root methods={methods}>
        <TargetSelector
          name="target"
          onNodeCreate={InfoNode.create}
          onEdgeCreate={DirectEdge.create}
          nodeId={nodeId}
          edge={edge}
          selectOptions={nodeNames}
        />
      </Form.Root>
    </Tabs.Content>
  );
}
