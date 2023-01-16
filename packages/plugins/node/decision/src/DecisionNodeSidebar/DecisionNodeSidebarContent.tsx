import {
  Heading,
  Stack,
  stackClasses,
  Tabs,
} from "@open-decision/design-system";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { useTranslations } from "next-intl";
import { DecisionNodePlugin } from "../DecisionNodePlugin";
import { InputPlugin } from "./InputPlugin";

const DecisionNode = new DecisionNodePlugin();

type Props = {
  nodeId: TNodeId;
};

export function DecisionNodeSidebarContent({ nodeId }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const treeClient = useTreeClient();
  const node = useTree(DecisionNode.getSingle(nodeId));

  if (!node) return null;

  return (
    <Tabs.Content
      value="Inhalt"
      className={stackClasses({}, "gap-6 focus-visible:outer-focus")}
    >
      <section>
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            DecisionNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.content}
          Label={t("richTextEditor.label")}
          maxHeight={400}
        />
      </section>
      <Stack className="gap-2">
        <Heading size="extra-small">Inputs</Heading>
        <InputPlugin inputId={node.input} nodeId={nodeId} />
      </Stack>
    </Tabs.Content>
  );
}
