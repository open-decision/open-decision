import {
  Box,
  css,
  ScrollArea,
  Grid,
  StyleObject,
  Row,
  Form,
} from "@open-decision/design-system";
import { OptionTargetInputs } from "../../../../features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { Node } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../../utilities/constants";
import { NodeMenu } from "../Canvas/Nodes/NodeMenu";
import {
  useInputs,
  useParents,
  useSelectedNodes,
  useStartNodeId,
} from "../../state/treeStore/hooks";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTreeContext } from "../../state/treeStore/TreeContext";
import { AnimatePresence, motion } from "framer-motion";
import { ParentNodeSelector } from "./ParentNodeSelector";
import { StartNodeLabel } from "../NodeLabels/StartNodeLabels";

const styledMotionDiv = css({
  position: "relative",
  gridRow: "1 / -1",
  gridColumn: "2",
  overflow: "hidden",
  zIndex: "$10",
  boxShadow: "$1",
  width: "100%",
  borderLeft: "1px solid $gray5",
});

export function NodeEditingSidebar() {
  const [selectionType, selectedNode] = useSelectedNodes();

  return (
    <AnimatePresence exitBeforeEnter>
      {selectionType === "single" ? (
        <motion.div
          key="sidebar"
          initial={{ x: "100%" }}
          animate={{
            x: 0,
            transition: { duration: 0.5, type: "spring", bounce: 0 },
          }}
          exit={{
            x: "100%",
            transition: {
              duration: 0.3,
              type: "spring",
              bounce: 0,
              delay: 0.1,
            },
          }}
          className={styledMotionDiv()}
        >
          <ScrollArea.Root
            css={{
              height: "100%",
              layer: "1",
              paddingInlineEnd: "$5",
              paddingInlineStart: "$5",
              paddingBlock: "$5",
              overflow: "hidden",
            }}
          >
            <ScrollArea.Viewport css={{ height: "100%" }}>
              <NodeEditingSidebarContent
                css={{ groupColor: "$gray11" }}
                node={{ id: selectedNode.id, data: selectedNode.data }}
              />
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
          </ScrollArea.Root>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type Props = { node: Pick<Node.TNode, "id" | "data">; css?: StyleObject };

export function NodeEditingSidebarContent({ node, css }: Props) {
  const inputs = useInputs(node.data.inputs);
  const { updateNodeContent } = useTreeContext();

  return (
    <Grid css={{ gridAutoRows: "max-content", gap: "$6", ...css }}>
      <Header node={node} key={node.id} />
      <Box as="section">
        <Form.Label
          as="h2"
          css={{
            margin: 0,
            marginBottom: "$3",
            display: "block",
          }}
        >
          Inhalt
        </Form.Label>
        <RichTextEditor
          onUpdate={({ editor }) =>
            updateNodeContent(node.id, editor.getJSON())
          }
          content={node.data.content}
        />
      </Box>
      <Box as="section">
        {Object.values(inputs).map((input) => (
          <OptionTargetInputs nodeId={node.id} input={input} key={input.id} />
        ))}
      </Box>
    </Grid>
  );
}

type HeaderProps = { node: Pick<Node.TNode, "id" | "data"> };

const Header = ({ node }: HeaderProps) => {
  const startNodeId = useStartNodeId();
  const { updateNodeName } = useTreeContext();
  const parentNodes = useParents(node.id);
  const isStartNode = node?.id === startNodeId;

  const formState = Form.useFormState({
    defaultValues: { name: node?.data.name ?? "" },
    setValues(values) {
      updateNodeName(node.id, values.name);
    },
  });

  return (
    <Form.Root state={formState}>
      <Row
        css={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
        as="header"
      >
        <Form.Label name={formState.names.name}>Knoten</Form.Label>
        <Row css={{ gap: "$2" }} center>
          {parentNodes.length > 0 ? (
            <ParentNodeSelector parentNodes={parentNodes} />
          ) : null}
          {isStartNode ? (
            <StartNodeLabel css={{ colorScheme: "success" }} />
          ) : null}
          <NodeMenu
            name={node.data.name ?? ""}
            nodeId={node.id}
            isStartNode={isStartNode}
          />
        </Row>
      </Row>
      <Form.Input
        name={formState.names.name}
        maxLength={nodeNameMaxLength}
        placeholder="Knotenname"
        css={{
          layer: "2",
          color: "$gray12",
        }}
      />
    </Form.Root>
  );
};
