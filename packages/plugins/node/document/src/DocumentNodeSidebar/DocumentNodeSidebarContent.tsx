import { useTemplateAPI } from "@open-decision/api-react-binding";
import {
  Button,
  buttonClasses,
  FileInput,
  Icon,
  Row,
  Tabs,
  Text,
} from "@open-decision/design-system";
import { Stack } from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { DocumentNodePlugin } from "../documentNodePlugin";
import { Cross1Icon } from "@radix-ui/react-icons";

const DocumentNode = new DocumentNodePlugin();

type Props = { nodeId: string };

export function DocumentNodeSidebarContent({ nodeId }: Props) {
  const treeClient = useTreeClient();
  const t = useTranslations("builder.nodeEditingSidebar");

  const { mutate: createTemplate } =
    useTemplateAPI().useCreateTemplateMutation();

  const node = useTree((treeClient) => {
    return DocumentNode.get.single(nodeId)(treeClient);
  });

  if (node instanceof Error) return null;
  return (
    <Tabs.Content value="Inhalt">
      <Stack className="gap-4">
        <section>
          <RichTextEditor
            maxHeight={400}
            data-test="richTextEditor"
            onUpdate={({ editor }) =>
              DocumentNode.updateNodeContent(
                nodeId,
                editor.getJSON()
              )(treeClient)
            }
            content={node.data.content}
            Label={t("richTextEditor.label")}
          />
        </section>
        <Stack className={sidebarCardClasses}>
          <FileInput
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            className={buttonClasses({})}
            onChange={(event) => {
              const treeUuid = treeClient.get.id();
              if (!treeUuid) return;

              if (!event.currentTarget.files?.[0]) return;

              createTemplate({
                template: event.currentTarget.files[0],
                treeUuid,
                displayName: "Test",
              });

              event.target.value = "";
            }}
          >
            Template hochladen
          </FileInput>
          <Row className="mt-2 justify-between items-center">
            <Text>PlaceholderFileName.docx</Text>
            <Button variant="neutral" size="small">
              <Icon>
                <Cross1Icon />
              </Icon>
            </Button>
          </Row>
        </Stack>
        {/* <Form.Root methods={methods}>
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
        </Form.Root> */}
      </Stack>
    </Tabs.Content>
  );
}
