import {
  Box,
  Button,
  useForm,
  Input,
  Label,
  ControlledInput,
  Stack,
  Icon,
  ValidationMessage,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../utilities/constants";
import { NodeMenu } from "./Canvas/Nodes/NodeMenu";
import { NodeLabel } from "./Canvas/Nodes/NodeLabel";
import { Star } from "react-feather";
import {
  selectNode,
  updateNodeContent,
  updateNodeName,
} from "../state/treeStore/treeStore";
import {
  useNodes,
  useParents,
  useSelectedNode,
  useStartNode,
  useTree,
} from "../state/treeStore/hooks";
import { Tiptap } from "components/TipTap";
import { Toolbar } from "components/RichTextEditor/Toolbar";

type NodeEditingSidebarProps = { node: BuilderNode.TNode };

export function NodeEditingSidebar({
  node,
}: NodeEditingSidebarProps): JSX.Element {
  const tree = useTree();
  const parentNodeIds = useParents(node.id);
  const startNode = useStartNode();
  const selectedNode = useSelectedNode();

  const parentNodes = useNodes(parentNodeIds);
  const [Form] = useForm({
    defaultValues: { name: node?.name ?? "" },
    mode: "onChange",
  });

  const isStartNode = node.id === startNode;

  return (
    <>
      <Box as="header" key={selectedNode?.id ?? ""}>
        <Form
          onSubmit={({ name }) => updateNodeName(node.id, name)}
          css={{ gap: "$2", display: "flex", flexDirection: "column" }}
        >
          <Stack
            css={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Label size="small">Knoten</Label>
            <Stack css={{ flexDirection: "row", gap: "$2" }}>
              {isStartNode ? (
                <NodeLabel
                  css={{
                    position: "relative",
                    top: "unset",
                    left: "unset",
                    colorScheme: "success",
                  }}
                >
                  <Icon size="extra-small">
                    <Star />
                  </Icon>
                  Start
                </NodeLabel>
              ) : null}
              <NodeMenu
                name={node.name}
                nodeId={node.id}
                isStartNode={isStartNode}
              />
            </Stack>
          </Stack>
          <ControlledInput
            name="name"
            maxLength={nodeNameMaxLength}
            validate={(val) =>
              BuilderTree.isUnique({ name: val })(tree.treeData)
                ? true
                : "Eine Node mit diesem Namen existiert bereits."
            }
            onChange={(event) => updateNodeName(node.id, event.target.value)}
          >
            {(field) => (
              <Input
                css={{ backgroundColor: "$gray1", color: "$gray12" }}
                {...field}
              />
            )}
          </ControlledInput>
          <ValidationMessage name="name" />
        </Form>
      </Box>
      <Box as="section">
        <Label
          size="small"
          as="h2"
          css={{
            margin: 0,
            marginBottom: "$2",
            display: "block",
          }}
        >
          Inhalt
        </Label>
        <Tiptap />
        {/* <RichTextEditor.Root
          value={node.content}
          setValue={(newValue) => updateNodeContent(node.id, newValue)}
        >
          <Box
            css={{
              display: "grid",
              borderRadius: "$md",
              overflow: "hidden",
              border: "1px solid $gray8",
              maxHeight: "600px",
              gridTemplateRows: "50px 1fr",
              $color: "$black",
            }}
          >
            <RichTextEditor.Toolbar css={{ borderBottom: "inherit" }} />
            <RichTextEditor.Editable
              css={{
                padding: "$2",
                backgroundColor: "$gray1",
                borderRadius: "0",
              }}
            />
          </Box>
        </RichTextEditor.Root> */}
      </Box>
      {Object.values(parentNodes).length > 0 ? (
        <Box as="section">
          <Label
            size="small"
            as="h2"
            css={{
              margin: 0,
              marginBottom: "$2",
              display: "block",
            }}
          >
            Elternknoten
          </Label>
          <Box
            css={{
              display: "flex",
              gap: "$2",
              marginTop: "$2",
              flexWrap: "wrap",
            }}
          >
            {Object.values(parentNodes).map((parentNode) => {
              return (
                <Button
                  size="extra-small"
                  variant="tertiary"
                  key={parentNode.id}
                  onClick={() => selectNode(parentNode.id)}
                  css={{
                    textAlign: "left",
                    wordBreak: "break-word",
                    focusStyle: "inner",
                  }}
                >
                  {parentNode.name}
                </Button>
              );
            })}
          </Box>
        </Box>
      ) : null}
      <Box as="section">
        <OptionTargetInputs node={node} />
      </Box>
    </>
  );
}
