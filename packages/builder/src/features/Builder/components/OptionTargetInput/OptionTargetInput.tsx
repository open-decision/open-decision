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
} from "@open-legal-tech/design-system";
import * as React from "react";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import { pipe } from "fp-ts/lib/function";
import { Plus, Trash, Crosshair } from "react-feather";
import { useNode } from "features/Builder/state/treeMachine/useNode";
import { DragHandle } from "./DragHandle";
import { useTree } from "features/Builder/state/treeMachine/useTree";
import { useUnmount } from "react-use";
import { Reorder, useDragControls } from "framer-motion";
import { map, values } from "remeda";

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});
type SingleSelectProps = { node: BuilderNode.TNode };

export function OptionTargetInputs({ node }: SingleSelectProps) {
  const [, send] = useTree();

  const relations = Object.values(node.relations);
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Box
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "$1",
        }}
      >
        <Label
          size="small"
          as="h2"
          css={{ margin: 0, display: "block", color: "$gray11" }}
        >
          Pfade
        </Label>
        <Button
          variant="neutral"
          square
          onClick={() =>
            send({ type: "addRelation", nodeId: node.id, relation: {} })
          }
        >
          <Icon label="Neue Antwortmöglichkeit hinzufügen">
            <Plus />
          </Icon>
        </Button>
      </Box>
      <StyledReorderGroup
        ref={ref}
        axis="y"
        values={relations}
        onReorder={(newOrder: BuilderRelation.TRelation[]) =>
          send({
            type: "updateNodeRelations",
            nodeId: node.id,
            relations: Object.fromEntries(
              newOrder.map((relation) => [relation.id, relation])
            ),
          })
        }
      >
        {relations.map((relation) => (
          <OptionTargetInput
            groupRef={ref}
            key={relation.id}
            relation={relation}
            onDelete={() =>
              send({
                type: "deleteRelation",
                nodeId: node.id,
                relationIds: [relation.id],
              })
            }
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
  const [tree, send] = useTree((state) => state.tree);
  const node = useNode(nodeId);
  const allOptions = pipe(
    tree.treeData.nodes,
    values,
    map((node) => ({ id: node.id, label: node.name }))
  );
  const nodeOptions = node
    ? pipe(
        BuilderTree.getConnectableNodes(node)(tree),
        values,
        map((node) => ({ id: node.id, label: node.name }))
      )
    : [];

  const controls = useDragControls();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const deselectRelation = () => send({ type: "selectRelation", id: "" });
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
        onSubmit={(data) =>
          send({
            type: "updateRelation",
            nodeId: node.id,
            relation: { ...relation, ...data },
          })
        }
        css={{
          display: "flex",
          position: "relative",
          gap: "$1",
          $color: "$black",
        }}
      >
        <Box
          onClick={() => send({ type: "selectRelation", id: relation.id })}
          ref={ref}
          css={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            border: "1px solid $gray8",
            borderRadius: "$md",
            backgroundColor: "$gray1",
          }}
        >
          <ControlledInput
            name="answer"
            onChange={(event) =>
              send({
                type: "updateRelationAnswer",
                nodeId: node.id,
                relationId: relation.id,
                answer: event.target.value,
              })
            }
          >
            {({ onBlur, ...field }) => (
              <Input
                css={{
                  borderRadius: "0",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                  gridColumn: "1 / -1",
                  borderBottom: "inherit",
                  margin: "-1px",
                  marginBottom: 0,
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
              const newNode = BuilderNode.createNewAssociatedNode(node, {
                name,
              });

              send([
                {
                  type: "addNode",
                  node: newNode,
                },
                {
                  type: "updateRelationTarget",
                  nodeId: node.id,
                  relationId: relation.id,
                  target: newNode.id,
                },
              ]);

              return { id: newNode.id, label: newNode.name };
            }}
            onSelectedItemChange={(newItem) =>
              send({
                type: "updateRelationTarget",
                nodeId: node.id,
                relationId: relation.id,
                target: newItem?.id ?? "",
              })
            }
            items={allOptions}
            subsetOfItems={nodeOptions}
          >
            <Combobox.Input
              menuCss={{
                backgroundColor: "$gray1",
                "&[data-state='open']": { border: "1px solid $gray8" },
              }}
              onBlur={deselectRelation}
              name="target"
            >
              {(field) => (
                <Input
                  placeholder="Zielknoten auswählen"
                  css={{ border: 0, borderRadius: 0, color: "$black" }}
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
            variant="ghost"
            size="small"
            type="button"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button
            variant="ghost"
            size="small"
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
  const [, send] = useTree();

  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "0",
        borderBottomLeftRadius: "inherit",
        border: "none",
        borderRight: "inherit",
        focusStyle: "inner",
        width: "40px",
        maxWidth: "100%",
        colorScheme: target ? "primary" : "gray",
      }}
      pressable={false}
      size="small"
      variant="secondary"
      onClick={() => {
        if (target) {
          send({ type: "selectNode", nodeId: target });
        }
      }}
      square
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
