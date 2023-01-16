import { stackClasses, Tabs } from "@open-decision/design-system";
import * as React from "react";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { InfoNodePlugin } from "../InfoNodePlugin";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { TNodeId } from "@open-decision/tree-type";

const InfoNode = new InfoNodePlugin();

type Props = {
  nodeId: TNodeId;
};

export function InfoNodeSidebarContent({ nodeId }: Props) {
  const treeClient = useTreeClient();

  const t = useTranslations("builder.nodeEditingSidebar");

  const content = useTree((treeClient) => {
    const node = InfoNode.getSingle(nodeId)(treeClient);

    if (!node) return undefined;

    return node.content;
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
          Label={t("richTextEditor.label")}
        />
      </section>
    </Tabs.Content>
  );
}
