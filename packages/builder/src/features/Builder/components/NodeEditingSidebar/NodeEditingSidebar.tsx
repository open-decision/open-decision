import {
  Box,
  useForm,
  Input,
  Label,
  ControlledInput,
  Stack,
  css,
} from "@open-decision/design-system";
import { OptionTargetInputs } from "features/Builder/components/OptionTargetInput/OptionTargetInput";
import * as React from "react";
import { Node } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../../utilities/constants";
import { NodeMenu } from "../Canvas/Nodes/NodeMenu";
import {
  useInputs,
  useParents,
  useSelectedNodes,
  useStartNode,
} from "../../state/treeStore/hooks";
import { RichTextEditor } from "components/RichTextEditor/RichTextEditor";
import { useTreeContext } from "../../state/treeStore/TreeContext";
import { AnimatePresence, motion } from "framer-motion";
import { ParentNodeSelector } from "./ParentNodeSelector";
import { StartNodeLabel } from "../NodeLabels/StartNodeLabels";

const styledMotionDiv = css({
  position: "relative",
  backgroundColor: "$gray2",
  gap: "$6",
  paddingInlineEnd: "$5",
  paddingInlineStart: "$5",
  paddingBlock: "$5",

  gridRow: "1 / -1",
  gridColumn: "2",
  groupColor: "$gray11",
  layer: "1",
  width: "100%",
  display: "grid",
  gridAutoRows: "max-content",
  overflow: "auto",
  height: "100%",
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
          <NodeEditingSidebarContent
            node={{ id: selectedNode.id, data: selectedNode.data }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type Props = { node: Pick<Node.TNode, "id" | "data"> };

export function NodeEditingSidebarContent({ node }: Props) {
  const { updateNodeName } = useTreeContext();
  const parentNodes = useParents(node.id);
  const startNode = useStartNode();

  const [Form] = useForm({
    defaultValues: { name: node?.data.name ?? "" },
    mode: "onChange",
  });

  const inputs = useInputs(node.data.inputs);

  const isStartNode = node?.id === startNode?.id;

  return (
    <>
      <Box as="header" key={node.id ?? ""}>
        <Form css={{ gap: "$2", display: "flex", flexDirection: "column" }}>
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
              {parentNodes ? (
                <ParentNodeSelector parentNodes={Object.values(parentNodes)} />
              ) : null}
              {isStartNode ? (
                <StartNodeLabel css={{ colorScheme: "success" }} />
              ) : null}
              <NodeMenu
                name={node.data.name ?? ""}
                nodeId={node.id}
                isStartNode={isStartNode}
              />
            </Stack>
          </Stack>
          <ControlledInput
            name="name"
            maxLength={nodeNameMaxLength}
            onChange={(event) => updateNodeName(node.id, event.target.value)}
          >
            {(field) => (
              <Input
                css={{
                  layer: "2",
                  color: "$gray12",
                }}
                {...field}
              />
            )}
          </ControlledInput>
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

      <Box as="section">
        {Object.values(inputs).map((input) => (
          <OptionTargetInputs nodeId={node.id} input={input} key={input.id} />
        ))}
      </Box>
    </>
  );
}