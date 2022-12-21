import { stackClasses, Tabs } from "@open-decision/design-system";
import {
  Form,
  Heading,
  Label,
  Stack,
  TargetSelector,
} from "@open-decision/design-system";
import { DirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { TNodeSidebarProps } from "../../../types/EditorPluginObject";
import { GroupNodePlugin } from "../groupNodePlugin";

const GroupNode = new GroupNodePlugin();
const DirectEdge = new DirectEdgePlugin();

type Props = { nodeId: string } & Pick<TNodeSidebarProps, "onNodeCreate">;

export function GroupNodeSidebarContent({ nodeId, onNodeCreate }: Props) {
  const node = useTree(GroupNode.get.single(nodeId));
  const treeClient = useTreeClient();

  const edge = useTree((treeClient) => {
    return Object.values(
      treeClient.edges.get.byNode(nodeId)?.source ?? {}
    )?.[0];
  });

  const t = useTranslations("builder.nodeEditingSidebar");

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
  );

  const targetNodeName = useTree((treeClient) => {
    return edge?.target
      ? treeClient.nodes.get.single(edge.target)?.name ?? "Zielknoten ohne Name"
      : undefined;
  });

  const methods = Form.useForm({
    defaultValues:
      node instanceof Error
        ? {}
        : {
            target: targetNodeName,
            title: node.data?.title ?? "",
            cta: node.data?.cta ?? "",
          },
  });

  if (node instanceof Error) return null;

  return (
    <Tabs.Content value="Inhalt" className={stackClasses({}, "gap-4")}>
      <section>
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            GroupNode.updateNodeContent(nodeId, editor.getJSON())(treeClient)
          }
          content={node.data.content}
          Label={(props) => (
            <Label className="m-0 mb-3 block" {...props}>
              {t("richTextEditor.label")}
            </Label>
          )}
          maxHeight={400}
        />
      </section>

      <Form.Root methods={methods}>
        <Heading size="extra-small" as="h3">
          Input Konfiguration
        </Heading>
        <Stack className="mb-4 gap-2">
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
        <TargetSelector
          name="target"
          nodeId={nodeId}
          edge={edge}
          onNodeCreate={onNodeCreate}
          onEdgeCreate={DirectEdge.create}
          selectOptions={nodeNames}
        />
      </Form.Root>
    </Tabs.Content>
  );
}
