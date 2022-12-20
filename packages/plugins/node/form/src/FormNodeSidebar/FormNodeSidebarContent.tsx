import { Tabs } from "@open-decision/design-system";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTreeClient, useTree } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { FormNodePlugin } from "../formNodePlugin";
import { InputPlugin } from "./InputPlugin";

const FormNode = new FormNodePlugin();

type Props = { nodeId: string };

export function FormNodeSidebarContent({ nodeId }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const treeClient = useTreeClient();

  const node = useTree(FormNode.get.single(nodeId));

  return (
    <Tabs.Content value="Inhalt">
      <section>
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            FormNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.data.content}
          Label={t("richTextEditor.label")}
          maxHeight={400}
        />
      </section>
      <InputPlugin inputIds={node.data.inputs} nodeId={node.id} />
    </Tabs.Content>
  );
}
