import {
  Box,
  Combobox,
  Form,
  Heading,
  IconButton,
  IconButtonProps,
  Input,
} from "@open-legal-tech/design-system";
import { useSelector } from "@xstate/react";
import { useEditor } from "features/Builder/state/useEditor";
import { useTreeService } from "features/Builder/state/useTree";
import * as React from "react";
import * as Node from "features/Builder/types/Node";
import * as Tree from "features/Builder/types/Tree";
import * as Record from "fp-ts/Record";
import * as Array from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { Plus, Trash, Crosshair } from "react-feather";
import { useNode } from "features/Builder/state/useNode";
import { DragHandle } from "./DragHandle";
import { createNewAssociatedNode } from "features/Builder/state/assignUtils";

type SingleSelectProps = { node: Node.TNode };

export function OptionTargetInputs({ node }: SingleSelectProps) {
  const service = useTreeService();

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
        <Heading size="extra-small" css={{ textTransform: "uppercase" }}>
          Pfade{" "}
          <Box css={{ color: "$gray11" }} as="span">
            / Einfachauswahl
          </Box>
        </Heading>
        <IconButton
          variant="tertiary"
          round
          Icon={<Plus />}
          label="Neue Antwortmöglichkeit hinzufügen"
          onClick={() => service.send({ type: "addRelation", nodeId: node.id })}
        />
      </Box>
      <Box css={{ display: "grid", gap: "$4" }}>
        {Object.values(node.data.relations).map((relation) => (
          <OptionTargetInput
            key={relation.id}
            input={relation}
            onChange={(newData) =>
              service.send({
                type: "updateRelation",
                nodeId: node.id,
                relationId: relation.id,
                relation: newData,
              })
            }
            onDelete={() =>
              service.send({
                type: "deleteRelation",
                nodeId: node.id,
                relationIds: [relation.id],
              })
            }
            nodeId={node.id}
          />
        ))}
      </Box>
    </>
  );
}
type SingleSelectInputProps = {
  input: Node.TRelation;
  nodeId: string;
  onChange: (relation: Omit<Node.TRelation, "id">) => void;
  onDelete: (id: string) => void;
};

export function OptionTargetInput({
  input,
  nodeId,
  onChange,
  onDelete,
}: SingleSelectInputProps): JSX.Element {
  const service = useTreeService();
  const tree = useSelector(service, (state) => state.context);
  const node = useSelector(service, (state) => state.context.nodes[nodeId]);
  const nodeOptions = pipe(
    Tree.getConnectableNodes(node)(tree),
    Record.toArray,
    Array.map(([, node]) => ({ id: node.id, label: node.data.label }))
  );

  return (
    <Form
      onChange={({ values }) => {
        onChange(values);
      }}
      initialValues={{ value: input.value ?? "", target: input.target ?? "" }}
      css={{
        display: "flex",
        position: "relative",
      }}
    >
      <Box
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
            border: 0,
            borderBottom: "inherit",
          }}
          name="value"
          placeholder="Antwort"
        />
        <NodeLink target={input.target} />
        <Combobox
          Input={
            <Input
              name="target"
              placeholder="Zielknoten auswählen"
              css={{ border: 0, borderRadius: 0 }}
            />
          }
          onCreate={(label) => {
            const newNode = createNewAssociatedNode(node, { label });
            service.send([
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

            return { id: newNode.id, label: newNode.data.label };
          }}
          menuCss={{
            backgroundColor: "$gray1",
            "&[data-state='open']": { border: "1px solid $gray8" },
          }}
          items={nodeOptions}
        />
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
      />
    </Form>
  );
}

type NodeLinkProps = { target?: string } & Omit<
  IconButtonProps,
  "label" | "Icon"
>;

function NodeLink({ target, ...props }: NodeLinkProps) {
  const { setSelectedNodeId } = useEditor();
  const node = useNode(target ?? "");

  return (
    // @ts-expect-error - IconButton has broken polymorphism
    <IconButton
      css={{
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
      onClick={() => (target ? setSelectedNodeId(target) : null)}
      disabled={!target}
      label={node ? `Gehe zu Node: ${node.data.label}` : "Keine Node verbunden"}
      Icon={<Crosshair />}
      {...props}
    />
  );
}
