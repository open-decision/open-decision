import {
  Box,
  Button,
  Form,
  Heading,
  Icon,
  InlineInput,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import { useTree, useTreeService } from "features/Builder/state/useTree";
import * as React from "react";
import { Edit2 } from "react-feather";
import { useNode, useNodes } from "../state/useNode";
import * as Tree from "features/Builder/types/Tree";
import { useEditor } from "../state/useEditor";

type NodeEditingSidebarProps = { nodeId: string };

export function NodeEditingSidebar({
  nodeId,
}: NodeEditingSidebarProps): JSX.Element {
  const service = useTreeService();
  const tree = useTree();
  const node = useNode(nodeId);
  const parentNodesIds = Tree.getParents(node)(tree);
  const { setSelectedNodeId } = useEditor();
  const parentNodes = useNodes(parentNodesIds);

  return (
    <>
      <Box as="header">
        <Form
          onChange={({ values }) => {
            service.send({
              type: "updateNodeData",
              nodeId,
              data: { label: values.nodeName },
            });
          }}
          initialValues={{ nodeName: node.data?.label ?? "" }}
        >
          <InlineInput
            borderless
            Icon={
              <Icon size="small" label="Editiere den Projektnamen">
                <Edit2 />
              </Icon>
            }
            css={{ textStyle: "medium-heading" }}
            name="nodeName"
            maxLength={70}
            alignByContent="left"
          />
        </Form>
      </Box>
      {Object.values(parentNodes).length > 0 ? (
        <Box as="section">
          <Heading size="extra-small" css={{ textTransform: "uppercase" }}>
            Parent-Nodes
          </Heading>
          <Box
            css={{
              display: "flex",
              gap: "$2",
              marginTop: "$2",
              flexWrap: "wrap",
            }}
          >
            {Object.values(parentNodes).map((parentNode) => (
              <Button
                size="small"
                variant="tertiary"
                key={parentNode.id}
                onClick={() => setSelectedNodeId(parentNode.id)}
              >
                {parentNode.data.label}
              </Button>
            ))}
          </Box>
        </Box>
      ) : null}
      <Box as="section">
        <Heading
          size="extra-small"
          css={{ textTransform: "uppercase", marginBottom: "$2" }}
        >
          Inhalt
        </Heading>
        <RichTextEditor
          value={node.data.content}
          setValue={(newValue) =>
            service.send({
              type: "updateNodeData",
              nodeId,
              data: { content: newValue },
            })
          }
        />
      </Box>
      <Box as="section">
        <OptionTargetInputs node={node} />
      </Box>
    </>
  );
}
