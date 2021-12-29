import {
  Box,
  Button,
  ButtonProps,
  Combobox,
  Form,
  Icon,
  Input,
  Label,
  styled,
} from "@open-legal-tech/design-system";
import * as React from "react";
import {
  BuilderTree,
  BuilderNode,
  BuilderRelation,
} from "@open-decision/type-classes";
import { pipe } from "fp-ts/lib/function";
import { Plus, Trash, Crosshair } from "react-feather";
import { useNode } from "features/Builder/state/useNode";
import { DragHandle } from "./DragHandle";
import { useTree } from "features/Builder/state/useTree";
import { useClickAway, useUnmount } from "react-use";
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
          marginBottom: "$4",
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
          variant="tertiary"
          round
          onClick={() => send({ type: "addRelation", nodeId: node.id })}
          square
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
            type: "updateNode",
            id: node.id,
            node: {
              relations: Object.fromEntries(
                newOrder.map((relation) => [relation.id, relation])
              ),
            },
          })
        }
      >
        {relations.map((relation) => (
          <OptionTargetInput
            groupRef={ref}
            key={relation.id}
            input={relation}
            onChange={(newData) =>
              send({
                type: "updateRelation",
                nodeId: node.id,
                relationId: relation.id,
                relation: newData,
              })
            }
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
  input: BuilderRelation.TRelation;
  nodeId: string;
  onChange: (relation: Omit<BuilderRelation.TRelation, "id">) => void;
  onDelete: (id: string) => void;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
};

export function OptionTargetInput({
  input,
  nodeId,
  onChange,
  onDelete,
  groupRef,
}: SingleSelectInputProps): JSX.Element {
  const [tree, send] = useTree();
  const node = useNode(nodeId);
  const allOptions = pipe(
    tree.context.nodes,
    values,
    map((node) => ({ id: node.id, label: node.name }))
  );
  const nodeOptions = pipe(
    BuilderTree.getConnectableNodes(node)(tree.context),
    values,
    map((node) => ({ id: node.id, label: node.name }))
  );

  const controls = useDragControls();

  const ref = React.useRef<HTMLDivElement | null>(null);

  useClickAway(ref, () => send({ type: "selectRelation", id: "" }));
  useUnmount(() => send({ type: "selectRelation", id: "" }));

  return (
    // FIXME Open issue -> https://github.com/framer/motion/issues/1313
    // The Reorder.Item creates a stacking context which makes it impossible to have the Combobox overlap other Reorder.Items
    <Reorder.Item
      value={input}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form
        onSubmit={(data) =>
          onChange({ answer: data.answer, target: data.target?.id })
        }
        onChange={(data) =>
          onChange({ answer: data.answer, target: data.target?.id })
        }
        defaultValues={{
          answer: input.answer ?? "",
          target: {
            id: input.target ?? "",
            label: input.target ? tree.context.nodes[input.target].name : "",
          },
        }}
        css={{
          display: "flex",
          position: "relative",
        }}
      >
        <Box
          onClick={() => send({ type: "selectRelation", id: input.id })}
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
            name="answer"
            placeholder="Antwort"
          />
          <NodeLink target={input.target} />
          <Combobox.Root
            name="target"
            onCreate={(name) => {
              const newNode = BuilderNode.createNewAssociatedNode(node, {
                name,
              });

              send([
                {
                  type: "addNode",
                  value: newNode,
                },
                {
                  type: "updateRelation",
                  nodeId: node.id,
                  relationId: input.id,
                  relation: {
                    target: newNode.id,
                  },
                },
              ]);

              return { id: newNode.id, label: newNode.name };
            }}
            items={allOptions}
            subsetOfItems={nodeOptions}
          >
            <Combobox.Input
              menuCss={{
                backgroundColor: "$gray1",
                "&[data-state='open']": { border: "1px solid $gray8" },
              }}
            >
              <Input
                name="target"
                placeholder="Zielknoten auswählen"
                css={{ border: 0, borderRadius: 0 }}
              />
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
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button
            css={{ colorScheme: "error" }}
            variant="ghost"
            size="small"
            type="button"
            onClick={() => onDelete(input.id)}
          >
            <Icon label="Entferne den Input">
              <Trash />
            </Icon>
          </Button>
        </Box>
      </Form>
    </Reorder.Item>
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
