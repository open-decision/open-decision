import {
  Box,
  css,
  ScrollArea,
  Grid,
  StyleObject,
  Row,
  Form,
  Label,
  DropdownMenu,
} from "@open-decision/design-system";
import * as React from "react";
import { Input, Node } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../../utilities/constants";
import { NodeMenu } from "../Canvas/Nodes/NodeMenu";
import {
  useParents,
  useSelectedNodes,
  useStartNodeId,
} from "../../state/treeStore/hooks";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTreeContext } from "../../state/treeStore/TreeContext";
import { AnimatePresence, motion } from "framer-motion";
import { ParentNodeSelector } from "./ParentNodeSelector";
import { StartNodeLabel } from "../NodeLabels/StartNodeLabels";
import { OptionTargetInputs } from "../InputConfigurators/OptionTargetInput/OptionTargetInput";

type InputHeaderProps = {
  children?: React.ReactNode;
  input: Input.TInput;
};

const InputHeader = ({ children, input }: InputHeaderProps) => {
  // const { updateInputType } = useTreeContext();

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "$2",
        marginBottom: "$3",
      }}
    >
      <Label as="h2" css={{ margin: 0, display: "block" }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <DropdownMenu.Button
              alignByContent="left"
              variant="neutral"
              size="small"
              css={{ textStyle: "medium-text" }}
            >
              {/* FIXME missing input types */}
              {/* {input.type.charAt(0).toUpperCase() + input.type.slice(1)} */}
            </DropdownMenu.Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {/* {Input.Types.options.map((typeOption) => {
              return (
                <DropdownMenu.Item
                  key={typeOption}
                  // onClick={() => updateInputType(input.id, typeOption)}
                >
                  {typeOption}
                </DropdownMenu.Item>
              );
            })} */}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Label>
      {children}
    </Box>
  );
};

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
    <AnimatePresence>
      {selectionType === "single" ? (
        <motion.div
          layout
          key={selectionType}
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
              paddingBlock: "$5",
              overflow: "hidden",
            }}
          >
            <ScrollArea.Viewport css={{ height: "100%" }}>
              <NodeEditingSidebarContent
                key={selectedNode.id}
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
  const {
    nodes: { updateContent },
  } = useTreeContext();

  return (
    <Grid
      css={{
        gridAutoRows: "max-content",
        gap: "$6",
        paddingInlineEnd: "$5",
        paddingInlineStart: "$5",
        ...css,
      }}
    >
      <Header node={node} />
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
          onUpdate={({ editor }) => updateContent(node.id, editor.getJSON())}
          content={node.data.content}
        />
      </Box>
      {/* {Object.values(inputs).map((input) => {
        switch (input.type) {
          case "select":
            return (
              <Box as="section" key={input.id}>
                <InputHeader input={input}>
                  <SingleSelectInput.PrimaryActionSlot input={input} />
                </InputHeader>
                <SingleSelectInput.Component nodeId={node.id} input={input} />
              </Box>
            );
          case "free-text":
            return (
              <Box as="section" key={input.id}>
                <InputHeader input={input} />
                <FreeTextInput.Component nodeId={node.id} inputId={input.id} />
              </Box>
            );
          default:
            return <Text>Der Input Typ existiert nicht</Text>;
        }
      })} */}
    </Grid>
  );
}

type HeaderProps = { node: Pick<Node.TNode, "id" | "data"> };

const Header = ({ node }: HeaderProps) => {
  const startNodeId = useStartNodeId();
  const {
    nodes: { updateName },
  } = useTreeContext();
  const parentNodes = useParents(node.id);
  const isStartNode = node?.id === startNodeId;

  const formState = Form.useFormState({
    defaultValues: { name: node?.data.name ?? "" },
    setValues(values) {
      updateName(node.id, values.name);
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
