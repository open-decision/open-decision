import {
  Box,
  StyleObject,
  Row,
  Form,
  Label,
  Stack,
  Sidebar,
} from "@open-decision/design-system";
import {
  getNodeNames,
  getParents,
  getStartNodeId,
  Node,
} from "@open-decision/tree-type";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTranslations } from "next-intl";
import {
  ParentNodeSelector,
  useEditor,
  NodeMenu,
  nodeNameMaxLength,
  NodeSidebar,
  StartNodeLabel,
} from "@open-decision/node-editor";
import { QuestionNodePlugin, TQuestionNode } from "./plugin";

export const QuestionNodeSidebar: NodeSidebar<TQuestionNode> = ({
  node,
  open,
}) => {
  return (
    <Sidebar open={open}>
      <Content
        css={{
          gridRow: "1 / -1",
          gridColumn: "2",
          zIndex: "$10",
          height: "100%",
          overflow: "hidden scroll",
          groupColor: "$gray11",
          borderLeft: "$border$layer",
        }}
        node={node}
      />
    </Sidebar>
  );
};

type Props = { node: TQuestionNode; css?: StyleObject };

function Content({ node, css }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const { replaceSelectedNodes } = useEditor();
  const treeClient = useTreeClient();

  const QuestionNode = new QuestionNodePlugin(treeClient);

  return (
    <Stack
      css={{
        groupColor: "$gray11",
        gap: "$6",
        flex: 1,
        layer: "1",
        paddingInlineEnd: "$5",
        paddingInlineStart: "$5",
        paddingBlock: "$5",
        ...css,
      }}
    >
      <Header nodeName={node.name} nodeId={node.id} />
      <Box as="section">
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            QuestionNode.updateNodeContent(node.id, editor.getJSON())
          }
          content={node.data.content}
          Label={(props) => (
            <Label
              css={{
                margin: 0,
                marginBottom: "$3",
                display: "block",
              }}
              {...props}
            >
              {t("richTextEditor.label")}
            </Label>
          )}
        />
      </Box>
      {/* <InputPluginComponent
        onClick={(target) => replaceSelectedNodes([target])}
        inputIds={node.data.inputs}
        nodeId={node.id}
      /> */}
    </Stack>
  );
}

type HeaderProps = { nodeName: Node.TNode["name"]; nodeId: Node.TNode["id"] };

const Header = ({ nodeName = "", nodeId }: HeaderProps) => {
  const t = useTranslations("builder.nodeEditingSidebar");
  const treeClient = useTreeClient();

  const startNodeId = useTree((tree) => getStartNodeId(tree));

  const parentNodes = useTree((tree) => {
    const parentNodeIds = getParents(tree)(nodeId);
    return Object.values(getNodeNames(tree)(parentNodeIds));
  });

  const isStartNode = nodeId === startNodeId;

  const formState = Form.useFormState({
    defaultValues: { name: nodeName },
    setValues(values) {
      treeClient.nodes.update.name(nodeId, values.name);
    },
  });

  return (
    <Form.Root state={formState} resetOnSubmit={false}>
      <Row
        css={{
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "26px",
        }}
        as="header"
      >
        <Form.Label name={formState.names.name}>
          {t("nameInput.label")}
        </Form.Label>
        <Row css={{ gap: "$2" }} center>
          {parentNodes.length > 0 ? (
            <ParentNodeSelector parentNodes={parentNodes} />
          ) : null}
          {isStartNode ? (
            <StartNodeLabel css={{ colorScheme: "success" }} />
          ) : null}
          <NodeMenu name={nodeName} nodeId={nodeId} isStartNode={isStartNode} />
        </Row>
      </Row>
      <Form.Input
        name={formState.names.name}
        maxLength={nodeNameMaxLength}
        placeholder={t("nameInput.placeholder")}
        css={{
          layer: "2",
          color: "$gray12",
        }}
      />
    </Form.Root>
  );
};
