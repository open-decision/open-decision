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
} from "@open-legal-tech/design-system";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../utilities/constants";
import { NodeMenu } from "./Canvas/Nodes/NodeMenu";
import { NodeLabel } from "./Canvas/Nodes/NodeLabel";
import { ChevronRight, Star } from "react-feather";
import { selectNode, updateNodeName } from "../state/treeStore/treeStore";
import {
  useNodes,
  useParents,
  useSelectedNode,
  useStartNode,
  useTree,
} from "../state/treeStore/hooks";
import { Tiptap } from "components/TipTap/TipTap";

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
              BuilderTree.isUnique({ name: val })(tree.treeData.nodes ?? {})
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
        <Tiptap id={node.id} content={node.content} />
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
                  onClick={() => selectNode(parentNode.id)}
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
                  {parentNode.name}
                </Link>
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
