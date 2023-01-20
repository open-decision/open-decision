import {
  Form,
  Heading,
  Stack,
  stackClasses,
  Tabs,
} from "@open-decision/design-system";
import { Label } from "@open-decision/design-system";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-ids";
import { useTranslations } from "next-intl";
import { sidebarCardClasses } from "../../components";
import { GroupNodePlugin } from "../GroupNodePlugin";

type Props = { nodeId: TNodeId; GroupNode: GroupNodePlugin };

export function GroupNodeSidebarContent({ nodeId, GroupNode }: Props) {
  const node = useTree(GroupNode.getSingle(nodeId));
  const treeClient = useTreeClient();

  const t = useTranslations("builder.nodeEditingSidebar");

  const methods = Form.useForm({
    defaultValues:
      node instanceof Error
        ? {}
        : {
            title: node?.title ?? "",
            cta: node?.cta ?? "",
          },
  });

  if (!node) return null;

  return (
    <Tabs.Content value="Inhalt" className={stackClasses({}, "gap-4")}>
      <section>
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            GroupNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.content}
          Label={(props) => (
            <Label className="m-0 mb-3 block" {...props}>
              {t("richTextEditor.label")}
            </Label>
          )}
          maxHeight={400}
        />
      </section>
      <Heading size="extra-small" as="h3">
        Input Konfiguration
      </Heading>
      <Form.Root methods={methods}>
        <Stack classNames={["mb-4 gap-2", sidebarCardClasses]}>
          <Form.Field Label="Gruppentitel">
            <Form.Input
              {...methods.register("title", {
                onChange: (event) => {
                  GroupNode.updateTitle(nodeId, event.target.value)(treeClient);
                },
              })}
            />
          </Form.Field>
          <Form.Field Label="Call to Action">
            <Form.Input
              {...methods.register("cta", {
                onChange: (event) => {
                  GroupNode.updateCta(nodeId, event.target.value)(treeClient);
                },
              })}
            />
          </Form.Field>
        </Stack>
      </Form.Root>
    </Tabs.Content>
  );
}
