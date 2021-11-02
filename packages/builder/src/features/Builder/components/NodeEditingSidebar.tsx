import {
  Box,
  Button,
  Field,
  Form,
  Input,
  Label,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { useNode, useNodes } from "../state/useNode";
import { useTree } from "../state/useTree";
import { Tree } from "@open-decision/type-classes";

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
          <Field label="Knotenname" css={{ color: "$gray11" }}>
            <Input
              css={{ fontWeight: 500, backgroundColor: "$gray1" }}
              name="nodeName"
              maxLength={70}
            />
          </Field>
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
            color: "$gray11",
          }}
        >
          Inhalt
        </Label>
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
          <Label
            size="small"
            as="h2"
            css={{
              margin: 0,
              marginBottom: "$2",
              display: "block",
              color: "$gray11",
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
