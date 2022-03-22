import {
  Box,
  useForm,
  Input,
  Label,
  ControlledInput,
  Stack,
  Icon,
  ValidationMessage,
  Link,
} from "@open-decision/design-system";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../utilities/constants";
import { NodeMenu } from "./Canvas/Nodes/NodeMenu";
import { NodeLabel } from "./Canvas/Nodes/NodeLabel";
import { ChevronRight, Star } from "react-feather";
import { useNodes, useParents, useStartNode } from "../state/treeStore/hooks";
import { RichTextEditor } from "components/RichTextEditor/RichTextEditor";
import {
  updateNodeName,
  syncedStore,
  addSelectedNodes,
} from "../state/treeStore/treeStore";

type Props = { node: BuilderNode.TNode };

export function NodeEditingSidebar({ node }: Props) {
  const parentNodeIds = useParents(node);
  const startNode = useStartNode();

  const parentNodes = useNodes(parentNodeIds);
  const [Form] = useForm({
    defaultValues: { name: node?.data.name ?? "" },
    mode: "onChange",
  });

  const isStartNode = node?.id === startNode;

  return node ? (
    <>
      <Box as="header" key={node.id ?? ""}>
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
            <Label>Knoten</Label>
            <Stack
              css={{ flexDirection: "row", gap: "$2", alignItems: "center" }}
            >
              {isStartNode ? (
                <NodeLabel
                  css={{
                    position: "relative",
                    top: "unset",
                    left: "unset",
                    colorScheme: "success",
                  }}
                >
                  <Icon>
                    <Star />
                  </Icon>
                  Start
                </NodeLabel>
              ) : null}
              <NodeMenu
                name={node.data.name}
                nodeId={node.id}
                isStartNode={isStartNode}
              />
            </Stack>
          </Stack>
          <ControlledInput
            name="name"
            maxLength={nodeNameMaxLength}
            validate={(val) =>
              BuilderTree.isUnique({ name: val })(syncedStore.nodes)
                ? true
                : "Eine Node mit diesem Namen existiert bereits."
            }
            onChange={(event) => updateNodeName(node.id, event.target.value)}
          >
            {(field) => (
              <Input css={{ layer: "2", color: "$gray12" }} {...field} />
            )}
          </ControlledInput>
          <ValidationMessage name="name" />
        </Form>
      </Box>
      <Box as="section">
        <Label
          as="h2"
          css={{
            margin: 0,
            marginBottom: "$3",
            display: "block",
          }}
        >
          Inhalt
        </Label>
        <RichTextEditor
          id={node.id}
          content={node.data.content}
          key={node.id}
        />
      </Box>
      {Object.values(parentNodes).length > 0 ? (
        <Box as="section">
          <Label
            as="h2"
            css={{
              margin: 0,
              marginBottom: "$3",
              display: "block",
            }}
          >
            Elternknoten
          </Label>
          <Box
            css={{
              display: "flex",
              gap: "$3",
              marginTop: "$3",
              flexWrap: "wrap",
            }}
          >
            {Object.values(parentNodes).map((parentNode) => {
              return (
                <Link
                  key={parentNode.id}
                  onClick={() => addSelectedNodes([parentNode.id])}
                  css={{
                    color: "$primary11",
                    fontWeight: 500,
                    cursor: "pointer",
                    wordBreak: "break-word",
                    display: "flex",
                    paddingRight: "$1",
                  }}
                >
                  <Icon>
                    <ChevronRight />
                  </Icon>
                  {parentNode.data.name}
                </Link>
              );
            })}
          </Box>
        </Box>
      ) : null}
      <Box as="section">
        <OptionTargetInputs nodeId={node.id} relations={node.data.relations} />
      </Box>
    </>
  ) : null;
}
