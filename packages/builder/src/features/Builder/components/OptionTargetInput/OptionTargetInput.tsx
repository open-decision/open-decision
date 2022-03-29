import {
  Box,
  Button,
  ButtonProps,
  Combobox,
  ControlledInput,
  Icon,
  Input,
  Label,
  styled,
  useForm,
  focusStyle,
} from "@open-decision/design-system";
import * as React from "react";
import { BuilderTree, BuilderNode } from "@open-decision/type-classes";
import { pipe } from "remeda";
import { Plus, Trash, Crosshair } from "react-feather";
import { DragHandle } from "./DragHandle";
import { Reorder, useDragControls } from "framer-motion";
import { map } from "remeda";
import {
  useEdge,
  useNode,
  useNodes,
} from "features/Builder/state/treeStore/hooks";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});

type SingleSelectProps = {
  nodeId: string;
  relations: BuilderNode.TNodeData["relations"];
};

export function OptionTargetInputs({ nodeId, relations }: SingleSelectProps) {
  const { addEdge, updateNodeRelations } = useTreeContext();
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <>
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
          Pfade
        </Label>
        <Button
          size="small"
          variant="secondary"
          onClick={() => addEdge({ source: nodeId, target: "" })}
        >
          <Icon label="Neue Antwortmöglichkeit hinzufügen">
            <Plus />
          </Icon>
          Hinzufügen
        </Button>
      </Box>
      <StyledReorderGroup
        ref={ref}
        axis="y"
        values={relations}
        layoutScroll
        onReorder={(newOrder: BuilderNode.TNodeData["relations"]) =>
          updateNodeRelations(nodeId, newOrder)
        }
      >
        {relations.map((relation) => (
          <OptionTargetInput
            nodeId={nodeId}
            relation={relation}
            key={relation}
            groupRef={ref}
          />
        ))}
      </StyledReorderGroup>
    </>
  );
}
type SingleSelectInputProps = {
  relation: string;
  nodeId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
};

export function OptionTargetInput({
  relation,
  nodeId,
  groupRef,
}: SingleSelectInputProps) {
  const nodes = useNodes();
  const node = useNode(nodeId);
  const {
    addAssociatedNode,
    updateEdge,
    updateEdgeAnswer,
    updateEdgeTarget,
    deleteEdges,
  } = useTreeContext();
  const edge = useEdge(relation);

  const allOptions = pipe(
    nodes,
    map((node) => ({ id: node.id, label: node.data.name }))
  );

  const nodeOptions = node
    ? pipe(
        BuilderTree.getConnectableNodes(node.id)(nodes),
        map((nodeId) => ({
          id: nodeId,
          label: nodes.find((node) => node.id === nodeId)?.data.name ?? "",
        }))
      )
    : [];

  const controls = useDragControls();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [Form] = useForm({
    defaultValues: {
      answer: edge?.data?.answer ?? "",
      target: edge?.target ?? "",
    },
  });

  return node && edge ? (
    <Reorder.Item
      value={edge.id}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form
        onSubmit={(data) =>
          updateEdge({
            ...edge,
            target: data.target,
            data: { answer: data.answer },
          })
        }
        css={{
          display: "flex",
          position: "relative",
          gap: "$1",
          groupColor: "$colorScheme-text",
        }}
      >
        <Box
          ref={ref}
          css={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            borderRadius: "$md",
            layer: "2",
          }}
        >
          <ControlledInput
            name="answer"
            onChange={(event) => updateEdgeAnswer(edge.id, event.target.value)}
          >
            {({ onBlur, ...field }) => (
              <Input
                css={{
                  borderRadius: "0",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                  gridColumn: "1 / -1",
                  marginBottom: "-1px",

                  ...focusStyle({
                    zIndex: "$10",
                  }),
                }}
                placeholder="Antwort"
                onBlur={() => {
                  onBlur?.();
                }}
                {...field}
              />
            )}
          </ControlledInput>
          <NodeLink target={edge.target} />
          <Combobox.Root
            name="target"
            onCreate={(name) => {
              const newNode = addAssociatedNode(
                node.id,
                { selected: true, data: { name } },
                edge.id
              );

              return { id: newNode.id, label: newNode.data.name };
            }}
            onSelectedItemChange={(newItem) =>
              updateEdgeTarget(edge.id, newItem?.id ?? "")
            }
            items={allOptions}
            subsetOfItems={nodeOptions}
          >
            <Combobox.Input name="target">
              {(field) => (
                <Input
                  placeholder="Zielknoten auswählen"
                  css={{
                    borderRadius: 0,
                    borderBottomRightRadius: "$md",
                  }}
                  {...field}
                />
              )}
            </Combobox.Input>
          </Combobox.Root>
        </Box>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="neutral"
            type="button"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button
            variant="neutral"
            type="button"
            square
            onClick={() => deleteEdges([edge.id])}
          >
            <Icon label="Entferne den Input">
              <Trash />
            </Icon>
          </Button>
        </Box>
      </Form>
    </Reorder.Item>
  ) : (
    <Box>Kein Knoten ausgewählt</Box>
  );
}

type NodeLinkProps = { target?: string } & Omit<ButtonProps, "label" | "Icon">;

function NodeLink({ target, ...props }: NodeLinkProps) {
  const node = useNode(target ?? "");
  const { addSelectedNodes, removeSelectedNodes } = useTreeContext();

  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "0",
        borderBottomLeftRadius: "inherit",
        focusType: "inner",
        maxWidth: "100%",
        colorScheme: target ? "primary" : "gray",
        border: "1px solid",
      }}
      pressable={false}
      size="small"
      variant="secondary"
      onClick={() => {
        if (target) {
          removeSelectedNodes();
          addSelectedNodes([target]);
        }
      }}
      type="button"
      disabled={!target}
      {...props}
    >
      <Icon
        label={
          node ? `Gehe zu Node: ${node.data.name}` : "Keine Node verbunden"
        }
      >
        <Crosshair />
      </Icon>
    </Button>
  );
}
