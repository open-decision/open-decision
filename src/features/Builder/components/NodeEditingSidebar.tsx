import {
  Box,
  Button,
  Form,
  Heading,
  Input,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { useNode, useNodes } from "../state/useNode";
import * as Tree from "features/Builder/types/Tree";
import { useTree } from "../state/useTree";

type NodeEditingSidebarProps = { nodeId: string };

export function NodeEditingSidebar({
  nodeId,
}: NodeEditingSidebarProps): JSX.Element {
  const [tree, send] = useTree();
  const node = useNode(nodeId);
  const parentNodesIds = Tree.getParents(node)(tree.context);
  const parentNodes = useNodes(parentNodesIds);

  return (
    <>
      <Box as="header">
        <Form
          onChange={({ values }) => {
            send({
              type: "updateNodeData",
              nodeId,
              data: { label: values.nodeName },
            });
          }}
          initialValues={{ nodeName: node.data?.label ?? "" }}
        >
          <Input
            css={{ textStyle: "medium-heading" }}
            name="nodeName"
            maxLength={70}
          />
        </Form>
      </Box>
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
            send({
              type: "updateNodeData",
              nodeId,
              data: { content: newValue },
            })
          }
        />
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
                onClick={() =>
                  send({ type: "selectNode", nodeId: parentNode.id })
                }
              >
                {parentNode.data.label}
              </Button>
            ))}
          </Box>
        </Box>
      ) : null}
      <Box as="section">
        <OptionTargetInputs node={node} />
      </Box>
    </>
  );
}
