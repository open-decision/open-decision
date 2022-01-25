import {
  Box,
  Button,
  Field,
  useForm,
  Input,
  Label,
  ControlledInput,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { useNodes } from "../state/useNode";
import { useTree } from "../state/useTree";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../utilities/constants";

type NodeEditingSidebarProps = { node: BuilderNode.TNode };

export function NodeEditingSidebar({
  node,
}: NodeEditingSidebarProps): JSX.Element {
  const [tree, send] = useTree();
  const parentNodesIds = React.useMemo(
    () => BuilderTree.getParents(node.id)(tree.context),
    [tree, node.id]
  );
  const parentNodes = useNodes(parentNodesIds);
  const [Form] = useForm({ defaultValues: { name: node?.name ?? "" } });

  return (
    <>
      <Box as="header" key={tree.context.selectedNodeId}>
        <Form
          onSubmit={({ name }) =>
            send({
              type: "updateNode",
              id: node.id,
              node: { name },
            })
          }
        >
          <Field label="Knotenname" css={{ "--color": "$colors$gray11" }}>
            <ControlledInput
              name="name"
              maxLength={nodeNameMaxLength}
              onChange={(event) =>
                send({
                  type: "updateNode",
                  id: node.id,
                  node: { name: event.target.value },
                })
              }
            >
              {(field) => (
                <Input
                  css={{ backgroundColor: "$gray1", color: "$gray12" }}
                  {...field}
                />
              )}
            </ControlledInput>
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
        >
          <Box
            css={{
              display: "grid",
              borderRadius: "$md",
              overflow: "hidden",
              border: "1px solid $gray8",
              maxHeight: "600px",
              gridTemplateRows: "50px 1fr",
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
                  css={{ textAlign: "left" }}
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
