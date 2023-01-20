import { stackClasses, Tabs } from "@open-decision/design-system";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTreeClient, useTree } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { useTranslations } from "next-intl";
import { FormNodePlugin } from "../FormNodePlugin";
import { InputPlugin } from "./InputPlugin";

const FormNode = new FormNodePlugin();

type Props = { nodeId: TNodeId };

export function FormNodeSidebarContent({ nodeId }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const treeClient = useTreeClient();

  const node = useTree(FormNode.getSingle(nodeId));

  if (!node) return null;

  return (
    <Tabs.Content value="Inhalt" className={stackClasses({}, "gap-4")}>
      <section>
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            FormNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.content}
          Label={t("richTextEditor.label")}
          maxHeight={400}
        />
      </section>
      {node.inputs ? (
        <InputPlugin inputIds={node.inputs} nodeId={node.id} />
      ) : null}
    </Tabs.Content>
  );
}
