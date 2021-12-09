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
import { useNodes } from "../state/useNode";
import { useTree } from "../state/useTree";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";

type NodeEditingSidebarProps = { node: BuilderNode.TNode };

export function NodeEditingSidebar({
  node,
}: NodeEditingSidebarProps): JSX.Element {
  const [tree, send] = useTree();
  const parentNodesIds = BuilderTree.getParents(node.id)(tree.context);
  const parentNodes = useNodes(parentNodesIds);

  return (
    <>
      <Box as="header">
        <Form
          onChange={({ values }) => {
            send({
              type: "updateNode",
              id: node.id,
              node: { name: values.nodeName },
            });
          }}
          initialValues={{ nodeName: node?.name ?? "" }}
        >
          <Field label="Knotenname" css={{ color: "$gray11" }}>
            <Input
              css={{ backgroundColor: "$gray1" }}
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
        <RichTextEditor.Root
          value={node.content}
          setValue={(newValue) =>
            send({
              type: "updateNode",
              id: node.id,
              node: { content: newValue },
            })
          }
          css={{
            display: "grid",
            gap: "$2",
            borderRadius: "$md",
            overflow: "hidden",
            border: "1px solid $gray8",
            backgroundColor: "$primary1",
          }}
        >
          <RichTextEditor.Toolbar />
          <RichTextEditor.Editable />
        </RichTextEditor.Root>
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
            {Object.values(parentNodes).map((parentNode) => {
              return (
                <Button
                  size="small"
                  variant="tertiary"
                  key={parentNode.id}
                  onClick={() =>
                    send({ type: "selectNode", nodeId: parentNode.id })
                  }
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
