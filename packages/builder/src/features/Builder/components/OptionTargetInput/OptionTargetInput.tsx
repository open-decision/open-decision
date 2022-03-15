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
} from "@open-decision/design-system";
import * as React from "react";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import { pipe } from "fp-ts/lib/function";
import { Plus, Trash, Crosshair } from "react-feather";
import { DragHandle } from "./DragHandle";
import { useUnmount } from "react-use";
import { Reorder, useDragControls } from "framer-motion";
import { map, values } from "remeda";
import {
  addAssociatedNode,
  addRelation,
  deleteRelations,
  deselectRelation,
  selectNode,
  selectRelation,
  updateNodeRelations,
  updateRelation,
  updateRelationAnswer,
  updateRelationTarget,
} from "features/Builder/state/treeStore/treeStore";
import { useNode, useNodes } from "features/Builder/state/treeStore/hooks";

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});

type SingleSelectProps = { node: BuilderNode.TNode };

export function OptionTargetInputs({ node }: SingleSelectProps) {
  const relations = Object.values(node.relations);
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
          onClick={() => addRelation(node.id, {})}
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
        initial={false}
        onReorder={(newOrder: BuilderRelation.TRelation[]) =>
          updateNodeRelations(
            node.id,
            Object.fromEntries(
              newOrder.map((relation) => [relation.id, relation])
            )
          )
        }
      >
        {relations.map((relation) => (
          <OptionTargetInput
            groupRef={ref}
            key={relation.id}
            relation={relation}
            onDelete={() => deleteRelations(node.id, [relation.id])}
            nodeId={node.id}
          />
        ))}
      </StyledReorderGroup>
    </>
  );
}
type SingleSelectInputProps = {
  relation: BuilderRelation.TRelation;
  nodeId: string;
  onDelete: (id: string) => void;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
};

export function OptionTargetInput({
  relation,
  nodeId,
  onDelete,
  groupRef,
}: SingleSelectInputProps): JSX.Element {
  const nodes = useNodes();

  const node = useNode(nodeId);
  const allOptions = pipe(
    nodes,
    values,
    map((node) => ({ id: node.id, label: node.name }))
  );
  const nodeOptions = node
    ? pipe(
        BuilderTree.getConnectableNodes(node)(nodes),
        values,
        map((node) => ({ id: node.id, label: node.name }))
      )
    : [];

  const controls = useDragControls();

  const ref = React.useRef<HTMLDivElement | null>(null);

  useUnmount(deselectRelation);

  const [Form] = useForm({
    defaultValues: {
      answer: relation.answer ?? "",
      target: relation.target ?? "",
    },
  });

  return node ? (
    <Reorder.Item
      value={relation}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form
        onSubmit={(data) => updateRelation(node.id, relation.id, data)}
        css={{
          display: "flex",
          position: "relative",
          gap: "$1",
          groupColor: "$colorScheme-text",
        }}
      >
        <Box
          onClick={() => selectRelation(relation.id)}
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
            onChange={(event) =>
              updateRelationAnswer(node.id, relation.id, event.target.value)
            }
          >
            {({ onBlur, ...field }) => (
              <Input
                css={{
                  borderRadius: "0",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                  gridColumn: "1 / -1",
                  marginBottom: "-1px",

                  "&:focus-within, &:focus-visible": {
                    zIndex: "$10",
                  },
                }}
                placeholder="Antwort"
                onBlur={() => {
                  deselectRelation();
                  onBlur?.();
                }}
                {...field}
              />
            )}
          </ControlledInput>
          <NodeLink target={relation.target} />
          <Combobox.Root
            name="target"
            onCreate={(name) => {
              const newNode = addAssociatedNode(node.id, relation.id, { name });
              if (!newNode) return { id: "", label: "" };

              return { id: newNode.id, label: newNode.name };
            }}
            onSelectedItemChange={(newItem) =>
              updateRelationTarget(node.id, relation.id, newItem?.id ?? "")
            }
            items={allOptions}
            subsetOfItems={nodeOptions}
          >
            <Combobox.Input onBlur={deselectRelation} name="target">
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
            onClick={() => onDelete(relation.id)}
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

  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "0",
        borderBottomLeftRadius: "inherit",
        focusStyle: "inner",
        maxWidth: "100%",
        colorScheme: target ? "primary" : "gray",
        border: "1px solid",
      }}
      pressable={false}
      size="small"
      variant="secondary"
      onClick={() => {
        if (target) selectNode(target);
      }}
      type="button"
      disabled={!target}
      {...props}
    >
      <Icon
        label={node ? `Gehe zu Node: ${node.name}` : "Keine Node verbunden"}
      >
        <Crosshair />
      </Icon>
    </Button>
  );
}
