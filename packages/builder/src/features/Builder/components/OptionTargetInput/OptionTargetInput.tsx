import {
  Box,
  Combobox,
  Form,
  IconButton,
  IconButtonProps,
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
import { usePartOfTree, useTree } from "features/Builder/state/useTree";
import { useClickAway, useUnmount } from "react-use";
import { Reorder, useDragControls } from "framer-motion";
import { map, values } from "remeda";

const StyledReorderGroup = styled(Box, {
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
        <IconButton
          variant="tertiary"
          round
          Icon={<Plus />}
          label="Neue Antwortmöglichkeit hinzufügen"
          onClick={() => send({ type: "addRelation", nodeId: node.id })}
        />
      </Box>
      <StyledReorderGroup
        ref={ref}
        // axis="y"
        // values={relations}
        // onReorder={(newOrder: BuilderRelation.TRelation[]) =>
        //   send({
        //     type: "updateNode",
        //     id: node.id,
        //     node: {
        //       relations: Object.fromEntries(
        //         newOrder.map((relation) => [relation.id, relation])
        //       ),
        //     },
        //   })
        // }
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
  const [tree, send] = usePartOfTree((state) => state.context);
  const node = useNode(nodeId);
  const nodeOptions = pipe(
    BuilderTree.getConnectableNodes(node)(tree),
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
    // <Reorder.Item
    //   value={input}
    //   dragListener={false}
    //   dragControls={controls}
    //   dragConstraints={groupRef}
    // >
    <Form
      onChange={({ values }) => onChange(values)}
      initialValues={{
        answer: input.answer ?? "",
        target: input.target ?? "",
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
          items={nodeOptions}
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
      <IconButton
        css={{ colorScheme: "error" }}
        variant="ghost"
        size="small"
        label="Entferne den Input"
        Icon={<Trash />}
        type="button"
        onClick={() => onDelete(input.id)}
      />
      <IconButton
        variant="ghost"
        size="small"
        label="Entferne den Input"
        type="button"
        Icon={<DragHandle />}
        onPointerDown={(event) => controls.start(event)}
      />
    </Form>
    // </Reorder.Item>
  );
}

type NodeLinkProps = { target?: string } & Omit<
  IconButtonProps,
  "label" | "Icon"
>;

function NodeLink({ target, ...props }: NodeLinkProps) {
  const node = useNode(target ?? "");
  const [, send] = useTree();

  return (
    <IconButton
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
      type="button"
      disabled={!target}
      label={node ? `Gehe zu Node: ${node.name}` : "Keine Node verbunden"}
      Icon={<Crosshair />}
      {...props}
    />
  );
}
